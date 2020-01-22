import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import './App.css';
import { Button, Container, Title, Card, Image, Content, Column, Notification, Navbar } from 'rbx';

const sizes = ['S','M','L','XL'];

const Banner = () => (
  <React.Fragment>
    <Navbar>
      <Navbar.Brand>
        <Navbar.Item>
          <strong>Shopping</strong>
        </Navbar.Item>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Segment align = 'end'>
          <Navbar.Item>
            <Button.Group>
              <Button color = 'primary'>
                <strong>Sign up</strong>
              </Button>
              <Button color = 'light'>Log in</Button>
              <Button color = 'danger'> 
              <strong>Cart</strong>
              </Button>
            </Button.Group>
          </Navbar.Item>
        </Navbar.Segment>
      </Navbar.Menu>
    </Navbar>
  </React.Fragment>
);

const Product = ({ products }) => (
  <React.Fragment>
    <Column size = 'one-quarter'>
      <Card class="card">
        <Card.Image>
          <Image.Container size = '3by4'>
            <Image src = {`data/products/${products.sku}_1.jpg`} />
          </Image.Container>
        </Card.Image>
        <Card.Content>
          <Content>
            <Title>{ products.title }</Title>
            <p>
              { products.description} 
            </p>
            <p>
            { products.style }
            </p>
          </Content>
        </Card.Content>
        <Card.Footer class="card-footer">
          <Column size = 'full'>
            <Notification>
              <SizeButtons />
            </Notification>
              <Column.Group gapless>
                <Card.Footer.Item>
                  { products.currencyFormat }{ products.price }
                </Card.Footer.Item>
                <Card.Footer.Item>
                  Add to cart
                </Card.Footer.Item>
              </Column.Group>
          </Column>
        </Card.Footer>
      </Card>
    </Column>
  </React.Fragment>
);



const ProductList = ({ products }) => {

return (
    <React.Fragment>
      <Column.Group multiline>
        { products.map(products => <Product key = { products.sku } products = { products }/>)}
      </Column.Group>
    </React.Fragment>
  );
};

const SizeButtons = () => (
  <Button.Group align = 'centered'>
      { Object.values(sizes)
        .map(value =>
          <Button rounded key = { value } >
              { value }
          </Button>
        )
      }
  </Button.Group>
);

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Banner/>
      </Container>
      <br/>
      <Container>
        <ProductList products={ products } />
      </Container>
    </React.Fragment>
  );
};

export default App;