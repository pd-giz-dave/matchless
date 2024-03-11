package matchless.service;

import java.util.Optional;
import matchless.domain.MaterialMethod;
import matchless.repository.MaterialMethodRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link matchless.domain.MaterialMethod}.
 */
@Service
@Transactional
public class MaterialMethodService {

    private final Logger log = LoggerFactory.getLogger(MaterialMethodService.class);

    private final MaterialMethodRepository materialMethodRepository;

    public MaterialMethodService(MaterialMethodRepository materialMethodRepository) {
        this.materialMethodRepository = materialMethodRepository;
    }

    /**
     * Save a materialMethod.
     *
     * @param materialMethod the entity to save.
     * @return the persisted entity.
     */
    public MaterialMethod save(MaterialMethod materialMethod) {
        log.debug("Request to save MaterialMethod : {}", materialMethod);
        return materialMethodRepository.save(materialMethod);
    }

    /**
     * Update a materialMethod.
     *
     * @param materialMethod the entity to save.
     * @return the persisted entity.
     */
    public MaterialMethod update(MaterialMethod materialMethod) {
        log.debug("Request to update MaterialMethod : {}", materialMethod);
        return materialMethodRepository.save(materialMethod);
    }

    /**
     * Partially update a materialMethod.
     *
     * @param materialMethod the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<MaterialMethod> partialUpdate(MaterialMethod materialMethod) {
        log.debug("Request to partially update MaterialMethod : {}", materialMethod);

        return materialMethodRepository
            .findById(materialMethod.getId())
            .map(existingMaterialMethod -> {
                if (materialMethod.getType() != null) {
                    existingMaterialMethod.setType(materialMethod.getType());
                }

                return existingMaterialMethod;
            })
            .map(materialMethodRepository::save);
    }

    /**
     * Get all the materialMethods.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<MaterialMethod> findAll(Pageable pageable) {
        log.debug("Request to get all MaterialMethods");
        return materialMethodRepository.findAll(pageable);
    }

    /**
     * Get one materialMethod by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MaterialMethod> findOne(Long id) {
        log.debug("Request to get MaterialMethod : {}", id);
        return materialMethodRepository.findById(id);
    }

    /**
     * Delete the materialMethod by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete MaterialMethod : {}", id);
        materialMethodRepository.deleteById(id);
    }
}
