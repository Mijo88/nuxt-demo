import ''

interface BaseEntity {
  '@id': string;
  uuid: string;
}

declare global {
  namespace TG {
    interface ProductEntity extends BaseEntity {
      price: number;
      description: string;
    }

    interface OrderEntity extends BaseEntity {
      products: ProductEntity[]
    }
  }
}
