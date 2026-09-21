import { MediaFrame, type MediaFrameProps } from "@/components/media-frame";
import { Badge, LabLink } from "@/components/ui/primitives";
import styles from "@/components/labwell-ui.module.css";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductData = {
  tag?: string;
  brand: string;
  title: string;
  description: string;
  specs?: ProductSpec[];
  media: MediaFrameProps;
  cta: {
    label: string;
    href: string;
  };
};

export function ProductCard({ product }: { product: ProductData }) {
  return (
    <article className={styles.productCard}>
      <div className={styles.productTopline}>
        {product.tag ? <Badge tone="brand">{product.tag}</Badge> : <span />}
        <span className={styles.productBrand}>{product.brand}</span>
      </div>
      <MediaFrame {...product.media} className={styles.productMedia} />
      <div className={styles.productBody}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        {product.specs?.length ? (
          <dl className={styles.productSpecs}>
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt className={styles.productSpecLabel}>{spec.label}</dt>
                <dd className={styles.productSpecValue}>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <LabLink
          href={product.cta.href}
          variant="button-secondary"
          trailingArrow
          className={styles.productCta}
        >
          {product.cta.label}
        </LabLink>
      </div>
    </article>
  );
}
