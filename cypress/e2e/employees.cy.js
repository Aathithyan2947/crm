// cypress/e2e/employees-page.cy.js

describe('Employees Page', () => {
  const baseUrl = Cypress.env('NEXT_PUBLIC_URL');

  beforeEach(() => {
    cy.visit(baseUrl + '/dashboard/employees');
  });

  it('loads the Employees page successfully', () => {
    cy.contains('Employees').should('exist');
    cy.get('[data-testid="custom-table"]').should('exist');
  });

  it('renders table rows when data is present', () => {
    cy.get('[data-testid="custom-table-row"]')
      .should('exist')
      .and('have.length.greaterThan', 0);
  });

  it('can navigate to the Add New Employee page', () => {
    cy.get('[data-testid="custom-table-add-button"] button').click();
    cy.url().should('include', '/dashboard/employees/new');
  });

  it('can toggle the filter section', () => {
    cy.get('[data-testid="custom-table-toggle-filters"]').click();
    cy.get('[data-testid="custom-table-filters"]').should('be.visible');

    cy.get('[data-testid="custom-table-toggle-filters"]').click();
    cy.get('[data-testid="custom-table-filters"]').should('not.exist');
  });

  it('should paginate to next page if available', () => {
    cy.get('[data-testid="custom-table-pagination"]').within(() => {
      cy.contains('Next').click();
    });

    cy.wait(500); // optional: better to use intercept in real test
    cy.get('[data-testid="custom-table-row"]').should('exist');
  });

  it('navigates to employee details page from row action', () => {
    cy.get('[data-testid^="custom-table-action-"]').first().click();
    cy.url().should('include', '/dashboard/employees/');
  });

  it('applies filter and reloads data', () => {
    cy.get('[data-testid="custom-table-toggle-filters"]').click();

    // Assumes dropdown filter input exists and can be selected
    cy.get('[data-testid="custom-filter-field-group"]').first().click();
    cy.get('[data-testid="custom-filter-option"]').first().click();

    cy.get('[data-testid="custom-table-row"]')
      .should('exist')
      .and('have.length.greaterThan', 0);
  });
});
