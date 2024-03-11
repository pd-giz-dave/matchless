package matchless.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import matchless.IntegrationTest;
import matchless.domain.MaterialMethod;
import matchless.domain.enumeration.MethodType;
import matchless.repository.MaterialMethodRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MaterialMethodResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MaterialMethodResourceIT {

    private static final MethodType DEFAULT_TYPE = MethodType.BUY;
    private static final MethodType UPDATED_TYPE = MethodType.MAKE;

    private static final String ENTITY_API_URL = "/api/material-methods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MaterialMethodRepository materialMethodRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMaterialMethodMockMvc;

    private MaterialMethod materialMethod;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MaterialMethod createEntity(EntityManager em) {
        MaterialMethod materialMethod = new MaterialMethod().type(DEFAULT_TYPE);
        return materialMethod;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MaterialMethod createUpdatedEntity(EntityManager em) {
        MaterialMethod materialMethod = new MaterialMethod().type(UPDATED_TYPE);
        return materialMethod;
    }

    @BeforeEach
    public void initTest() {
        materialMethod = createEntity(em);
    }

    @Test
    @Transactional
    void createMaterialMethod() throws Exception {
        int databaseSizeBeforeCreate = materialMethodRepository.findAll().size();
        // Create the MaterialMethod
        restMaterialMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isCreated());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeCreate + 1);
        MaterialMethod testMaterialMethod = materialMethodList.get(materialMethodList.size() - 1);
        assertThat(testMaterialMethod.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void createMaterialMethodWithExistingId() throws Exception {
        // Create the MaterialMethod with an existing ID
        materialMethod.setId(1L);

        int databaseSizeBeforeCreate = materialMethodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMaterialMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = materialMethodRepository.findAll().size();
        // set the field null
        materialMethod.setType(null);

        // Create the MaterialMethod, which fails.

        restMaterialMethodMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMaterialMethods() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        // Get all the materialMethodList
        restMaterialMethodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(materialMethod.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getMaterialMethod() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        // Get the materialMethod
        restMaterialMethodMockMvc
            .perform(get(ENTITY_API_URL_ID, materialMethod.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(materialMethod.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMaterialMethod() throws Exception {
        // Get the materialMethod
        restMaterialMethodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMaterialMethod() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();

        // Update the materialMethod
        MaterialMethod updatedMaterialMethod = materialMethodRepository.findById(materialMethod.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMaterialMethod are not directly saved in db
        em.detach(updatedMaterialMethod);
        updatedMaterialMethod.type(UPDATED_TYPE);

        restMaterialMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaterialMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMaterialMethod))
            )
            .andExpect(status().isOk());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
        MaterialMethod testMaterialMethod = materialMethodList.get(materialMethodList.size() - 1);
        assertThat(testMaterialMethod.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, materialMethod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(materialMethod)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMaterialMethodWithPatch() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();

        // Update the materialMethod using partial update
        MaterialMethod partialUpdatedMaterialMethod = new MaterialMethod();
        partialUpdatedMaterialMethod.setId(materialMethod.getId());

        restMaterialMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaterialMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaterialMethod))
            )
            .andExpect(status().isOk());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
        MaterialMethod testMaterialMethod = materialMethodList.get(materialMethodList.size() - 1);
        assertThat(testMaterialMethod.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateMaterialMethodWithPatch() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();

        // Update the materialMethod using partial update
        MaterialMethod partialUpdatedMaterialMethod = new MaterialMethod();
        partialUpdatedMaterialMethod.setId(materialMethod.getId());

        partialUpdatedMaterialMethod.type(UPDATED_TYPE);

        restMaterialMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaterialMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaterialMethod))
            )
            .andExpect(status().isOk());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
        MaterialMethod testMaterialMethod = materialMethodList.get(materialMethodList.size() - 1);
        assertThat(testMaterialMethod.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, materialMethod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isBadRequest());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMaterialMethod() throws Exception {
        int databaseSizeBeforeUpdate = materialMethodRepository.findAll().size();
        materialMethod.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaterialMethodMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(materialMethod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MaterialMethod in the database
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMaterialMethod() throws Exception {
        // Initialize the database
        materialMethodRepository.saveAndFlush(materialMethod);

        int databaseSizeBeforeDelete = materialMethodRepository.findAll().size();

        // Delete the materialMethod
        restMaterialMethodMockMvc
            .perform(delete(ENTITY_API_URL_ID, materialMethod.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MaterialMethod> materialMethodList = materialMethodRepository.findAll();
        assertThat(materialMethodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
