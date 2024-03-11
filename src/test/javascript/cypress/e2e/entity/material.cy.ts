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

describe('Material e2e test', () => {
  const materialPageUrl = '/material';
  const materialPageUrlPattern = new RegExp('/material(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const materialSample = { name: 'thermostat' };

  let material;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/materials+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/materials').as('postEntityRequest');
    cy.intercept('DELETE', '/api/materials/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (material) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/materials/${material.id}`,
      }).then(() => {
        material = undefined;
      });
    }
  });

  it('Materials menu should load Materials page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('material');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Material').should('exist');
    cy.url().should('match', materialPageUrlPattern);
  });

  describe('Material page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(materialPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Material page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/material/new$'));
        cy.getEntityCreateUpdateHeading('Material');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/materials',
          body: materialSample,
        }).then(({ body }) => {
          material = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/materials+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/materials?page=0&size=20>; rel="last",<http://localhost/api/materials?page=0&size=20>; rel="first"',
              },
              body: [material],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(materialPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Material page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('material');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialPageUrlPattern);
      });

      it('edit button click should load edit Material page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Material');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialPageUrlPattern);
      });

      it('edit button click should load edit Material page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Material');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialPageUrlPattern);
      });

      it('last delete button click should delete instance of Material', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('material').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', materialPageUrlPattern);

        material = undefined;
      });
    });
  });

  describe('new Material page', () => {
    beforeEach(() => {
      cy.visit(`${materialPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Material');
    });

    it('should create an instance of Material', () => {
      cy.get(`[data-cy="name"]`).type('painfully likely');
      cy.get(`[data-cy="name"]`).should('have.value', 'painfully likely');

      cy.get(`[data-cy="description"]`).type('hm now');
      cy.get(`[data-cy="description"]`).should('have.value', 'hm now');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        material = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', materialPageUrlPattern);
    });
  });
});
