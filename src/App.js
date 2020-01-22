import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import './App.css'
import { Button, Container, Title, Card, Image, Content, Column, Notification } from 'rbx';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import Button2 from '@material-ui/core/Button';
import { makeStyles, AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, GridList, GridListTile, GridListTileBar } from '@material-ui/core';

const sizes = ['S','M','L','XL'];

const staticcart = {
  "12064273040195392": {
    "sku": 12064273040195392,
    "title": "Cat Tee Black T-Shirt",
    "description": "4 MSL",
    "style": "Black with custom print",
    "price": 10.9,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true
  },
  "51498472915966370": {
    "sku": 51498472915966370,
    "title": "Dark Thug Blue-Navy T-Shirt",
    "description": "",
    "style": "Front print and paisley print",
    "price": 29.45,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true
  },
  "10686354557628304": {
    "sku": 10686354557628304,
    "title": "Sphynx Tie Dye Wine T-Shirt",
    "description": "GPX Poly 1",
    "style": "Front tie dye print",
    "price": 9,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true
  },
  "11033926921508488": {
    "sku": 11033926921508488,
    "title": "Skuul",
    "description": "Training 2014",
    "style": "Black T-Shirt with front print",
    "price": 14,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true
  },
  "39876704341265610": {
    "sku": 39876704341265610,
    "title": "Wine Skul T-Shirt",
    "description": "",
    "style": "Wine",
    "price": 13.25,
    "currencyId": "USD",
    "currencyFormat": "$",
    "isFreeShipping": true
  },
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  }
}));

const useStylescart = makeStyles(theme => ({
  root: {
    width: 200,
    marginRight:8
  },
  gridlisttilebar: {
    display:'flex',
    height: 100
  }
}));

const useStylesgrid = makeStyles(theme => ({
  root: {
    display:'flex',
    flexDirection:'column',
  },
  container: {
    alignItems:'flex-start',
    justifyContent:'flex-start',
    paddingTop:10,
    height: 300,
  },
  gridList: {
      height:280,
      flexWrap: 'nowrap',
      flexGrow:1,
      transform: 'translateZ(0)',
    }
}));

const Banner = () => {
  const classes = useStyles();
  const [cart, setCart] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = event => {
    setCart(event.target.checked);
  };
  
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return(
    <React.Fragment className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Shopping
          </Typography>
          <Button2 color="inherit">Sign up</Button2>
          <Button2 color="inherit">Log in</Button2>
          {cart && (
            <React.Fragment>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <ShoppingCart />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>
                  <strong>Your Cart</strong>
                </MenuItem>
                <MenuItem>
                <CartList products={ staticcart } />
                </MenuItem>
                <MenuItem>
                  Total Price: XX
                </MenuItem>
                <MenuItem onClick={handleClose}>Close Cart</MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

const ProductCard = ({ products }) => {
  const classes = useStylescart();
  const size = "M"
  const quantity = 2;

  const caption = (
    <React.Fragment>
      <Typography variant='body2'>
        Size: {size}
      </Typography>
      <Typography variant='body2'>
        Quantity: {quantity}
      </Typography>
      <Typography variant='body2'>
        Price: {products.currencyFormat}{products.price}
      </Typography>
    </React.Fragment>
  );

  return(
    <GridListTile key={products.sku} className={classes.root}>       
      <img src={`./data/products/${products.sku}_2.jpg`} alt={products.title}/>
    <GridListTileBar className={classes.gridlisttilebar}
      title={products.title}
      subtitle={caption}
      actionIcon={
        <IconButton color='inherit'>
          <DeleteIcon />
        </IconButton>
        }
    />
    </GridListTile>
  )
};

const Product = ({ products }) => (
  <React.Fragment>
    <Column size = 'one-quarter'>
      <Card>
        <Card.Image>
          <Image.Container size = '3by4'>
            <Image src = {`./data/products/${products.sku}_1.jpg`} />
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
        <Card.Footer>
          <Column size = 'full'>
            <Notification>
              <SizeButtons />
            </Notification>
              <Column.Group gapless>
                <Card.Footer.Item>
                  { products.currencyFormat }{ products.price }
                </Card.Footer.Item>
                <Card.Footer.Item>
                  <Button color="warning">Add to cart</Button>
                </Card.Footer.Item>
              </Column.Group>
          </Column>
        </Card.Footer>
      </Card>
    </Column>
  </React.Fragment>
);

const CartList = ({ products }) => {
  const classes = useStylesgrid();
  const data = Object.values(products);

  return (
    <React.Fragment className={classes.root}>
        <GridList className={classes.gridList}>
          { data.map(products => <ProductCard key = { products.sku } products = { products }/>)}
        </GridList>
    </React.Fragment>
  );
};

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
  <Button.Group align = "centered">
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