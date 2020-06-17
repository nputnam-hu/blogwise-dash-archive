import React from 'react'

import styles from './PricingCard.module.sass'
import lightning from './small-lightning.png'
import BlueButton from '../../../../../../components/BlueButton'

const PricingCard = ({
  bgColor,
  title,
  price,
  userNum,
  pageViews,
  branding,
  description,
  activePlan,
  onClick,
  onTrial,
}) => (
  <div
    className={styles.pricingCard}
    style={activePlan ? { border: '1px solid rgba(68,122,220, 0.67)' } : {}}
  >
    <div className={styles.pricingCard__top} style={{ background: bgColor }}>
      <div className={styles.pricingCard__top__title}>{title}</div>
    </div>
    <div className={styles.pricingCard__body}>
      <div className={styles.pricingCard__body__price}>${price}</div>
      <div className={styles.pricingCard__body__perMonth}>
        per month, billed monthly
      </div>
      <div className={styles.pricingCard__body__list}>
        <div className={styles.listItem}>
          <img
            src={lightning}
            className={styles.listItem__image}
            alt="Bullet Point"
          />
          <div className={styles.listItem__text}>
            {userNum} Staff User
            {(parseInt(userNum, 10) > 1 || userNum === 'Unlimited') && 's'}
          </div>
        </div>
        <div className={styles.listItem}>
          <img
            src={lightning}
            className={styles.listItem__image}
            alt="Bullet Point"
          />
          <div className={styles.listItem__text}>{pageViews} page views/mo</div>
        </div>
        <div className={styles.listItem}>
          <img
            src={lightning}
            className={styles.listItem__image}
            alt="Bullet Point"
          />
          <div className={styles.listItem__text}>
            {branding ? 'blogwise branding' : 'ad free'}
          </div>
        </div>
      </div>
      <span className={styles.pricingCard__description}>{description}</span>
      <br />
      {!onTrial && !activePlan && (
        <BlueButton onClick={onClick} text="Switch" />
      )}
    </div>
  </div>
)

export default PricingCard
