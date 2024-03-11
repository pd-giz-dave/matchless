package matchless.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import matchless.domain.MaterialMethod;
import matchless.repository.MaterialMethodRepository;
import matchless.service.MaterialMethodService;
import matchless.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link matchless.domain.MaterialMethod}.
 */
@RestController
@RequestMapping("/api/material-methods")
public class MaterialMethodResource {

    private final Logger log = LoggerFactory.getLogger(MaterialMethodResource.class);

    private static final String ENTITY_NAME = "materialMethod";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MaterialMethodService materialMethodService;

    private final MaterialMethodRepository materialMethodRepository;

    public MaterialMethodResource(MaterialMethodService materialMethodService, MaterialMethodRepository materialMethodRepository) {
        this.materialMethodService = materialMethodService;
        this.materialMethodRepository = materialMethodRepository;
    }

    /**
     * {@code POST  /material-methods} : Create a new materialMethod.
     *
     * @param materialMethod the materialMethod to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new materialMethod, or with status {@code 400 (Bad Request)} if the materialMethod has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<MaterialMethod> createMaterialMethod(@Valid @RequestBody MaterialMethod materialMethod)
        throws URISyntaxException {
        log.debug("REST request to save MaterialMethod : {}", materialMethod);
        if (materialMethod.getId() != null) {
            throw new BadRequestAlertException("A new materialMethod cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MaterialMethod result = materialMethodService.save(materialMethod);
        return ResponseEntity
            .created(new URI("/api/material-methods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /material-methods/:id} : Updates an existing materialMethod.
     *
     * @param id the id of the materialMethod to save.
     * @param materialMethod the materialMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated materialMethod,
     * or with status {@code 400 (Bad Request)} if the materialMethod is not valid,
     * or with status {@code 500 (Internal Server Error)} if the materialMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MaterialMethod> updateMaterialMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MaterialMethod materialMethod
    ) throws URISyntaxException {
        log.debug("REST request to update MaterialMethod : {}, {}", id, materialMethod);
        if (materialMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, materialMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!materialMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MaterialMethod result = materialMethodService.update(materialMethod);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, materialMethod.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /material-methods/:id} : Partial updates given fields of an existing materialMethod, field will ignore if it is null
     *
     * @param id the id of the materialMethod to save.
     * @param materialMethod the materialMethod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated materialMethod,
     * or with status {@code 400 (Bad Request)} if the materialMethod is not valid,
     * or with status {@code 404 (Not Found)} if the materialMethod is not found,
     * or with status {@code 500 (Internal Server Error)} if the materialMethod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MaterialMethod> partialUpdateMaterialMethod(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MaterialMethod materialMethod
    ) throws URISyntaxException {
        log.debug("REST request to partial update MaterialMethod partially : {}, {}", id, materialMethod);
        if (materialMethod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, materialMethod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!materialMethodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MaterialMethod> result = materialMethodService.partialUpdate(materialMethod);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, materialMethod.getId().toString())
        );
    }

    /**
     * {@code GET  /material-methods} : get all the materialMethods.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of materialMethods in body.
     */
    @GetMapping("")
    public ResponseEntity<List<MaterialMethod>> getAllMaterialMethods(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of MaterialMethods");
        Page<MaterialMethod> page = materialMethodService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /material-methods/:id} : get the "id" materialMethod.
     *
     * @param id the id of the materialMethod to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the materialMethod, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MaterialMethod> getMaterialMethod(@PathVariable("id") Long id) {
        log.debug("REST request to get MaterialMethod : {}", id);
        Optional<MaterialMethod> materialMethod = materialMethodService.findOne(id);
        return ResponseUtil.wrapOrNotFound(materialMethod);
    }

    /**
     * {@code DELETE  /material-methods/:id} : delete the "id" materialMethod.
     *
     * @param id the id of the materialMethod to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterialMethod(@PathVariable("id") Long id) {
        log.debug("REST request to delete MaterialMethod : {}", id);
        materialMethodService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
