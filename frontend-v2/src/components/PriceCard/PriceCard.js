import React from 'react';
import PriceCardWrapper, {
  Title,
  Price,
  PricingHeader,
  PricingList,
  PriceAction,
  Button,
} from './PriceCard.style';
import { Avatar, Popover } from 'antd';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function PriceCard({ className, data, buttonText }) {
  let price, pricingPlan, image, linkedin, github;

  if (data.type === 'annually') {
    price = Math.ceil(data.price) * 12;
    pricingPlan = '/per year';
    image = data.img;
    linkedin = data.linkedin;
    github = data.github;
  } else {
    price = data.price;
    pricingPlan = '/per month';
    image = data.img;
    linkedin = data.linkedin;
    github = data.github;
  }

  return (
    <PriceCardWrapper className={className}>
      <PricingHeader>
        <div style={{ lineHeight: '64px', margin: '10px 0 20px 0' }}>
          <Avatar
            size={200}
            src={image}
          />
        </div>
        <Title>{data.title}</Title>
        <Price>
          <strong>{price}</strong>
          {/* <span>{pricingPlan}</span> */}
        </Price>
      </PricingHeader>
      <PricingList>
        {data.features.map((feature) => (
          <li key={feature.title}>
            {feature.icon}
            <span>{feature.title}</span>
          </li>
        ))}
      </PricingList>
      <PriceAction>
        <Popover content="Ir a LinkedIn">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >

            <FaLinkedin className="linkedin" />
          </a>
        </Popover>
        <Popover content="Ir a Github">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="github" />
          </a>
        </Popover>
        {/* <Button><FaLinkedin /></Button>
        <Button>Hola</Button> */}
      </PriceAction>
    </PriceCardWrapper>
  );
}
