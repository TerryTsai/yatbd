package yatbd.zelda;


@SuppressWarnings("RedundantIfStatement")
public enum Math {

    ; // Utility
    
    public static boolean collides(
            float pX, float pY, float pHW, float pHH,
            float qX, float qY, float qHW, float qHH
    ) {
        if (pX + pHW < qX - qHW)
            return false;
        if (pX - pHW > qX + qHW)
            return false;
        if (pY + pHH < qY - qHH)
            return false;
        if (pY - pHH > qY + qHH)
            return false;
        return true;
    }

}
