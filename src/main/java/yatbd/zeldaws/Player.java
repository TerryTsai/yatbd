package yatbd.zeldaws;

class Player {

    private static int MAX_ID = 0;

    private final int id;
    private String status;
    private String direction;
    private float x, y;

    Player() {
        this.id = MAX_ID++;
        this.status = "IDLE";
        this.direction = "";
        this.x = 0;
        this.y = 0;
    }

    void update(String rawData) {
        String[] data = rawData.split(",");

        this.status = data[0];
        this.direction = data[1];
        this.x = Float.parseFloat(data[2]);
        this.y = Float.parseFloat(data[3]);
    }

    @Override
    public String toString() {
        return String.format("%d,%s,%s,%f,%f", id, status, direction, x, y);
    }
}
