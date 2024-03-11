package matchless.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class MaterialTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Material getMaterialSample1() {
        return new Material().id(1L).name("name1").description("description1");
    }

    public static Material getMaterialSample2() {
        return new Material().id(2L).name("name2").description("description2");
    }

    public static Material getMaterialRandomSampleGenerator() {
        return new Material().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
