package matchless.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class MaterialMethodTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static MaterialMethod getMaterialMethodSample1() {
        return new MaterialMethod().id(1L);
    }

    public static MaterialMethod getMaterialMethodSample2() {
        return new MaterialMethod().id(2L);
    }

    public static MaterialMethod getMaterialMethodRandomSampleGenerator() {
        return new MaterialMethod().id(longCount.incrementAndGet());
    }
}
