type RestaurantProps = {
  restaurantId: string;
};

export class Restaurant {
  constructor(readonly props: RestaurantProps) {}

  get restaurantId(): string {
    return this.props.restaurantId;
  }
}
