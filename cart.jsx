// simulate getting products from DataBase
const products = [
  { name: "Apples_:", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans__:", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);
  console.log("*************INSIDE CART******************");
  // neither of these showing up in console ^

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = () => {
  const { useState, useEffect } = React;
  const [data, setData] = useState();
  const [url, setUrl] = useState("http://localhost:1337/api/products");
  const [isLoading, setIsLoading] = useState(false);

  console.log("Rendering App");

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(url);
      console.log("**********************")
      console.log(result.data.data[0])
      // this^ works but data is still burried in another obj, adding .data and .attributes didn't work
      console.log("*********************")
      setData(result.data.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return [setUrl];
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;

  //  Fetch Data
  const { Fragment, useState, useEffect} = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data }, fetchData] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data - no it doesn't, it renders the products variable
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    if (item[0].instock == 0) return;
    item[0].instock = item[0].instock - 1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
  };

  const deleteCartItem = (delIndex) => {
    let newCart = cart.filter((item, i) => delIndex != i);
    let target = cart.filter((item, index) => delIndex == index)
    let newItems = items.map((item, index) => {
      if (item.name == target[0].name) item.instock = item.instock + 1;
      return item;
    });
    setCart(newCart);
    setItems(newItems);
  };

  let list = items.map((item, index) => {
    let n = index + 10;
    let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={url} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}: ${item.cost} - Stock: {item.instock}
        </Button>
        <input name={item.name} type="submit" onClick={addToCart}></input>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item key={1+index} eventKey={1 + index}>
      <Accordion.Header>
        {item.name}
      </Accordion.Header>
      <Accordion.Body onClick={() => deleteCartItem(index)}
        eventKey={1 + index}>
        $ {item.cost} from {item.country}
      </Accordion.Body>
    </Accordion.Item>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };

  //TODO: implement the restockProducts function
  const restockProducts = (url) => {
    let data = fetchData(url);
    // now the error is "doFetch is not a function" but we don't see the same error in the old code which also only uses doFetch in this function and in data/isLoading set state
    console.log("YYYYYYYYYYY");
    console.log(url); // works if we remove doFetch
    console.log("YYYYYYYYYYY")
    let newItems = data.data.map((item) => { //Error = "Cannot read properties of undefined (reading 'data')" which is why I tried to define data above
      let { name, country, cost, instock } = item;
      return { name, country, cost, instock }
    });
    console.log("@@@@@@@@@@@")
    console.log(newItems)
    console.log("@@@@@@@@@@@")
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            //console.log("---------------")
            // console.log("INSIDE SUMBIT")
            // console.log("+++++++"+query)
            // console.log("---------------")
            restockProducts(query);
            console.log(`Restock called on ${query}`);
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
