package matchless.domain;

import static matchless.domain.MaterialMethodTestSamples.*;
import static matchless.domain.MaterialTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;
import matchless.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MaterialTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Material.class);
        Material material1 = getMaterialSample1();
        Material material2 = new Material();
        assertThat(material1).isNotEqualTo(material2);

        material2.setId(material1.getId());
        assertThat(material1).isEqualTo(material2);

        material2 = getMaterialSample2();
        assertThat(material1).isNotEqualTo(material2);
    }

    @Test
    void methodTest() throws Exception {
        Material material = getMaterialRandomSampleGenerator();
        MaterialMethod materialMethodBack = getMaterialMethodRandomSampleGenerator();

        material.addMethod(materialMethodBack);
        assertThat(material.getMethods()).containsOnly(materialMethodBack);
        assertThat(materialMethodBack.getName()).isEqualTo(material);

        material.removeMethod(materialMethodBack);
        assertThat(material.getMethods()).doesNotContain(materialMethodBack);
        assertThat(materialMethodBack.getName()).isNull();

        material.methods(new HashSet<>(Set.of(materialMethodBack)));
        assertThat(material.getMethods()).containsOnly(materialMethodBack);
        assertThat(materialMethodBack.getName()).isEqualTo(material);

        material.setMethods(new HashSet<>());
        assertThat(material.getMethods()).doesNotContain(materialMethodBack);
        assertThat(materialMethodBack.getName()).isNull();
    }
}
