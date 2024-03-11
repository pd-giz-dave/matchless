package matchless.repository;

import matchless.domain.MaterialMethod;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MaterialMethod entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaterialMethodRepository extends JpaRepository<MaterialMethod, Long> {}
