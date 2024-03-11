import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('MaterialMethod e2e test', () => {
  const materialMethodPageUrl = '/material-method';
  const materialMethodPageUrlPattern = new RegExp('/material-method(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const materialMethodSample = { type: 'MAKE' };

  let materialMethod;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/material-methods+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/material-methods').as('postEntityRequest');
    cy.intercept('DELETE', '/api/material-methods/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (materialMethod) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/material-methods/${materialMethod.id}`,
      }).then(() => {
        materialMethod = undefined;
      });
    }
  });

  it('MaterialMethods menu should load MaterialMethods page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('material-method');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MaterialMethod').should('exist');
    cy.url().should('match', materialMethodPageUrlPattern);
  });

  describe('MaterialMethod page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(materialMethodPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MaterialMethod page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/material-method/new$'));
        cy.getEntityCreateUpdateHeading('MaterialMethod');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialMethodPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/material-methods',
          body: materialMethodSample,
        }).then(({ body }) => {
          materialMethod = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/material-methods+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/material-methods?page=0&size=20>; rel="last",<http://localhost/api/material-methods?page=0&size=20>; rel="first"',
              },
              body: [materialMethod],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(materialMethodPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MaterialMethod page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('materialMethod');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialMethodPageUrlPattern);
      });

      it('edit button click should load edit MaterialMethod page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MaterialMethod');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialMethodPageUrlPattern);
      });

      it('edit button click should load edit MaterialMethod page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MaterialMethod');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialMethodPageUrlPattern);
      });

      it('last delete button click should delete instance of MaterialMethod', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('materialMethod').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialMethodPageUrlPattern);

        materialMethod = undefined;
      });
    });
  });

  describe('new MaterialMethod page', () => {
    beforeEach(() => {
      cy.visit(`${materialMethodPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MaterialMethod');
    });

    it('should create an instance of MaterialMethod', () => {
      cy.get(`[data-cy="type"]`).select('MAKE');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        materialMethod = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', materialMethodPageUrlPattern);
    });
  });
});
