import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import './App.css';
import { Button, Container, Title, Card, Image, Content, Column, Notification } from 'rbx';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import Button2 from '@material-ui/core/Button';
import { makeStyles, AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, GridList, GridListTile, GridListTileBar } from '@material-ui/core';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyBvQSe8lJBVqGDx5Uwcb6xQiQKoX7B84Ho",
  authDomain: "learn-react-22d7b.firebaseapp.com",
  databaseURL: "https://learn-react-22d7b.firebaseio.com",
  projectId: "learn-react-22d7b",
  storageBucket: "learn-react-22d7b.appspot.com",
  messagingSenderId: "233798744459",
  appId: "1:233798744459:web:0d3bc32a4226ab91e3978e"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database().ref();

const sizes = ['S','M','L','XL'];

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

const CheckOutButton = (cart_data) => {
  
  const handleCheckOut = () => {

    var updates = {};

    for (var i = 0; i < cart_data.cart_data.cart_data.length; i++)
    {
      updates["/"+cart_data.cart_data.cart_data[i].id+"/"+cart_data.cart_data.cart_data[i].size] = cart_data.cart_data.inven[cart_data.cart_data.cart_data[i].id][cart_data.cart_data.cart_data[i].size] - cart_data.cart_data.cart_data[i].quantity
    }

    cart_data.cart_data.setCart_data([]);

    return firebase.database().ref().update(updates);
  };

  return(
    <Button2 size="large" onClick={handleCheckOut}>Check Out</Button2>
  )
}

const Banner = (cart_data, setCart_data, inven, setInven) => {
  const classes = useStyles();
  const [cart, setCart] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState(null);
  const [checkout, setCheckout] = useState(true);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckOutstate = () => {
    setCheckout(false);
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return(
    <React.Fragment className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Shopping
          </Typography>
          <Typography hidden={checkout} variant="h6" className={classes.title}>
            Successfully Checked Out!
          </Typography>
          <React.Fragment>
            { user ?<Welcome user={user}/>: <SignIn/> }
          </React.Fragment>
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
                <CartList cart_data={cart_data} setCart_data={setCart_data}/>
                </MenuItem>
                <MenuItem>
                <TotalPrice cart_data={cart_data}/>
                </MenuItem>
                <MenuItem onClick={() => {handleClose(); handleCheckOutstate();}}>
                  <CheckOutButton cart_data={cart_data}/>
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

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <div>
      Welcome, {user.displayName}
      <Button2 className="logout" color="inherit" onClick={() => firebase.auth().signOut()}>
        Log Out
      </Button2>
  </div>
);

const SignIn = () => (
    <StyledFirebaseAuth
      uiConfig={uiConfig}
      firebaseAuth={firebase.auth()}
    />
)

const ProductCard = ({ products, cart_data, setCart_data }) => {
  const classes = useStylescart();
  const [remove, setRemove] = useState(false);

  const handleRemove = () => {
    console.log("removing")
    if (products.quantity === 1) {
      const newcart = cart_data.cart_data.filter(r => r.id + r.size !== products.id + products.size);
      cart_data.setCart_data(newcart);
    }
    else {
      products.quantity--
      setRemove(!remove)
    }
  }

  const caption = (
    <React.Fragment>
      <Typography variant='body2'>
        Size: {products.size}
      </Typography>
      <Typography variant='body2'>
        Quantity: {products.quantity}
      </Typography>
      <Typography variant='body2'>
        Price: {products.currency}{products.price*products.quantity}
      </Typography>
    </React.Fragment>
  );

  return(
    <GridListTile key={products.id} className={classes.root}>       
      <img src={`./data/products/${products.id}_2.jpg`} alt={products.name}/>
    <GridListTileBar className={classes.gridlisttilebar}
      title={products.name}
      subtitle={caption}
      actionIcon={
        <IconButton color='inherit'>
          <DeleteIcon onClick = {handleRemove}/>
        </IconButton>
        }
    />
    </GridListTile>
  )
};

const CartList = ({ cart_data, setCart_data }) => {
  const classes = useStylesgrid();

  if (cart_data.cart_data.length !== 0) {
    return (
      <React.Fragment className={classes.root}>
          <GridList className={classes.gridList}>
            { cart_data.cart_data.map(products => <ProductCard key = { products.sku } products = { products } cart_data={cart_data} setCart_data={setCart_data}/>)}
          </GridList>
      </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
        Empty Cart
      </React.Fragment>
    );
  }
};

const TotalPrice = ({cart_data}) => {
  var tp = 0

  if (cart_data.cart_data.length !== 0) {
    for (var i = 0; i < cart_data.cart_data.length; i++) {
      tp = tp + cart_data.cart_data[i].price * cart_data.cart_data[i].quantity
    }
  }
  
  return (
    <React.Fragment>
      Total Price: ${tp}
    </React.Fragment>
  )
}

const Product = ({ key, products, cart_data, setCart_data, inven, setInven }) => {
  const [size, setSize] = useState();

  let cartproduct = {
    id: products.sku,
    name: products.title,
    description: products.description,
    style: products.style,
    currency: products.currencyFormat,
    price: products.price,
    quantity: 1,
    size: ""
  }

  const handleClick = ()=> {
    if (size === "") {
      alert("Please select a size!");
      return;
    }

    cartproduct.size = size
    if (cart_data.length === 0) {
      const newcart = cart_data.concat([cartproduct])
      setCart_data(newcart)
    }
    else {
      let found = false
      for (var i = 0; i < cart_data.length; i++)
      {
        if (cart_data[i].id === cartproduct.id && cart_data[i].size === size) {
          found = true;
          break;
        }
      }
      
      if (found) {
        cart_data[i].quantity++
      }
      else {
        const newcart = cart_data.concat([cartproduct])
        setCart_data(newcart)
      }
    }

    setSize("")
  };

  return(
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
              <SizeButtons size={size} setSize={setSize} inven={inven} setInven={setInven} products={products}/>
            </Notification>
              <Column.Group gapless>
                <Card.Footer.Item>
                  { products.currencyFormat }{ products.price }
                </Card.Footer.Item>
                <Card.Footer.Item>
                  <Button color="warning" onClick={handleClick}>Add to cart</Button>
                </Card.Footer.Item>
              </Column.Group>
          </Column>
        </Card.Footer>
      </Card>
    </Column>
  </React.Fragment>
  );
};

const ProductList = ({ products, cart_data, setCart_data, inven, setInven }) => {

return (
    <React.Fragment>
      <Column.Group multiline>
        { products.map(products => <Product key = { products.sku } products = { products } cart_data = {cart_data} setCart_data = {setCart_data}
          inven={inven} setInven={setInven}/>)}
      </Column.Group>
    </React.Fragment>
  );
};

const buttonColor = selected => (
  selected ? `button is-success is-selected` : 'button'
);

const SizeButtons = ({size, setSize, inven, setInven, products}) => {
  let id = products.sku
  let realsize = []

  if (inven !== undefined)
  {
    let temp = inven[id]
    for (var i = 0; i < 4; i++) {
      if (temp[sizes[i]] > 0) {
        realsize.push(sizes[i])
      }
    } 
  }
  
  if (realsize.length > 0) {
    return (
      <Button.Group align = "centered">
      { Object.values(realsize)
        .map(value =>
          <Button rounded key = { value } 
          className={ buttonColor(value === size) }
          onClick={ () => setSize(value) }
          >
              { value }
          </Button>
        )
      }
    </Button.Group>
    );
  }
  else {
    return (
      <React.Fragment>
        Out of Stock
      </React.Fragment>
    )
  }
};


const App = () => {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);
  const products = Object.values(data);
  const [cart_data, setCart_data] = useState([]);
  const [inven, setInven] = useState();

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setInven(snap.val());
    }
    db.on('value', handleData, error => alert(error));
    return () => {
      db.off('value', handleData);
    };
  }, []);

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
        <Banner cart_data = {cart_data} setCart_data = {setCart_data} inven = {inven} setInven = {setInven}/>
      </Container>
      <br/>
      <Container>
        <ProductList products={ products } cart_data = {cart_data} setCart_data = {setCart_data} inven={inven} setInven={setInven}/>
      </Container>
    </React.Fragment>
  );
};


export default App;