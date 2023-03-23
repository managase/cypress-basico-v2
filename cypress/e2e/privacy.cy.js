Cypress._.times(10, function () {
    it('22 - Utilizar a função do Lodash - Section 8 - 35', function() {
        cy.visit('./src/privacy.html')
        cy.contains('Talking About Testing').should('be.visible')
    })
})


