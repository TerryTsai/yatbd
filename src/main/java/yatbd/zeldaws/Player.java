package yatbd.zeldaws;

class Player {

    private static int MAX_ID = 0;

    private final int id;
    private String status;
    private String direction;
    private float x, y;

    Player() {
        this.id = MAX_ID++;
        this.status = "STAND";
        this.direction = "down";
        this.x = 0;
        this.y = 0;
    }

    void update(String[] data) {
        if (data[0].equals("s")) {
            this.status = data[1];
            this.direction = data[2];
            this.x = Float.parseFloat(data[3]);
            this.y = Float.parseFloat(data[4]);
        }
    }

    @Override
    public String toString() {
        return String.format("%d,%s,%s,%f,%f", id, status, direction, x, y);
    }
}
