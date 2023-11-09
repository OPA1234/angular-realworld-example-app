describe('Test with backend', () =>{

    beforeEach('login to the app', () =>{
        cy.intercept({method: 'Get', path: 'tags'}, {fixture: 'tags.json'})
        cy.loginToApplication()
    })


    it('verify correct request and response ', () => {


        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles')
        
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Novi Artikal')
        cy.get('[formcontrolname="description"]').type('Ovo je opis')
        cy.get('[formcontrolname="body"]').type('Ovo je body od ovog artikla')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then(xhr => {

            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(201)
            expect(xhr.request.body.article.body).to.equal('Ovo je body od ovog artikla')
            expect(xhr.response.body.article.description).to.equal('Ovo je opis')
        })


    })


    it('verify popular tags are displayed', () =>{

        cy.get('.tag-list')
        .should('contain', 'welcome')
        .and('contain', 'nemanjici')
        .and('contain', 'automation')
        .and('contain', 'testing')
    })


    it('verify global feed likes count', () =>{

        cy.intercept('GET', 'https://api.realworld.io/api/articles*', {fixture: 'articles.json'})

        cy.get('app-article-list button').then(heartList =>{
            expect(heartList[0]).to.contain(500000)
            expect(heartList[1]).to.contain(10000)
        })


        cy.fixture('articles.json').then(file =>{
            const articleLink =  file.articles[1].slug
            file.articles[1].favoritesCount = 10001
            cy.intercept('POST', 'https://api.realworld.io/api/articles/'+articleLink+'/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '10001')


    })

    it('intercepting and modifyinf the request adn response ', () => {


        // cy.intercept('POST', '**/articles/', (req) =>{
        //     req.body.article.description = "Ovo je opis 2"
        // }).as('postArticles')

        
        cy.intercept('POST', '**/articles/', (req) =>{
            req.reply(res => {
                expect(res.body.article.description).to.equal('Ovo je opis')
                res.body.article.description = "Ovo je opis 2"
            })
        }).as('postArticles')
        
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Novi Artikal')
        cy.get('[formcontrolname="description"]').type('Ovo je opis')
        cy.get('[formcontrolname="body"]').type('Ovo je body od ovog artikla')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles').then(xhr => {

            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(201)
            expect(xhr.request.body.article.body).to.equal('Ovo je body od ovog artikla')
            expect(xhr.response.body.article.description).to.equal('Ovo je opis 2')
        })


    })

    it.only('delete new article in a global feed', () =>{

        const userCredentials = {
            "user": {
                "email": "rastko@nemanjici.com",
                "password": "Test123"
            }
        }

        const bodyRequest = {
            "article": {
                "title": "Omaz Juznom Vetru ",
                "description": "API Test",
                "body": "Sinan Kemal Mile",
                "tagList": []
            }
        }

        cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        .its('body').then(body => {

            const token = body.user.token

            cy.request({
                url: 'https://api.realworld.io/api/articles/',
                headers: { 'Authorization': 'Token '+token},
                method: 'POST',
                body: bodyRequest,
            }).then(response => {
                expect(response.status).to.equal(201)
            })

            cy.contains('Global Feed').click()
            cy.get('.preview-link').first().click()
            cy.get('.article-actions').contains('Delete Article').click()


            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: { 'Authorization': 'Token '+token},
                method: 'GET',
            }).its('body').then (body =>{
                expect(body.articles[0].title).not.to.equal('Omaz Juznom Vetru ')
            })
        })


    })





})