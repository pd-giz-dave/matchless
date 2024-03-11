package matchless.domain;

import static matchless.domain.MaterialMethodTestSamples.*;
import static matchless.domain.MaterialTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import matchless.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MaterialMethodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MaterialMethod.class);
        MaterialMethod materialMethod1 = getMaterialMethodSample1();
        MaterialMethod materialMethod2 = new MaterialMethod();
        assertThat(materialMethod1).isNotEqualTo(materialMethod2);

        materialMethod2.setId(materialMethod1.getId());
        assertThat(materialMethod1).isEqualTo(materialMethod2);

        materialMethod2 = getMaterialMethodSample2();
        assertThat(materialMethod1).isNotEqualTo(materialMethod2);
    }

    @Test
    void nameTest() throws Exception {
        MaterialMethod materialMethod = getMaterialMethodRandomSampleGenerator();
        Material materialBack = getMaterialRandomSampleGenerator();

        materialMethod.setName(materialBack);
        assertThat(materialMethod.getName()).isEqualTo(materialBack);

        materialMethod.name(null);
        assertThat(materialMethod.getName()).isNull();
    }
}
