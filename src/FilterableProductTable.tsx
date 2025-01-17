import React, { useState } from 'react';

const PRODUCTS = [
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Green Beans' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Apple' },
  { category: 'Fruits', price: '$1', stocked: true, name: 'Dragonfruit' },
  { category: 'Snacks', price: '$5', stocked: true, name: 'Popcorn' },
  { category: 'Fruits', price: '$2', stocked: false, name: 'Passionfruit' },
  { category: 'Vegetables', price: '$2', stocked: true, name: 'Spinach' },
  { category: 'Vegetables', price: '$4', stocked: false, name: 'Pumpkin' },
  { category: 'Vegetables', price: '$1', stocked: true, name: 'Peas' },
];

interface Product {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
}

interface ProductTableProps {
  products: Product[];
  filteredText: string;
  checkmark: boolean;
  deleteHandler: ((id: string) => void)
}

interface SearchBarProps {
  setFilteredTextProp: React.Dispatch<React.SetStateAction<string>>;
  setCheckmarkProp: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ProductRowProps {
  name: string;
  price: string;
  deleteHandler: (id: string) => void
}

function transformToProductsByCat(products: Product[]): { [key: string]: Product[] } {
  const groupProducts: { [key: string]: Product[] } = {};
  products.forEach((product) => {
    product.category in groupProducts
      ? groupProducts[product.category].push(product)
      : (groupProducts[product.category] = [product]);
  });
  return groupProducts;
}

function FilterableProductTable(props: Pick<ProductTableProps, "products">) {
  const [filteredText, setFilteredText] = useState('');
  const [checkmark, setCheckmark] = useState(false);
  const [products, setProducts] = useState(props.products);

  function addHandler(formElement: HTMLFormElement) {

    const formData = new FormData(formElement);
    const newProduct = {
      category: formData.get("category")?.toString() ?? "",
      price: formData.get("price")?.toString() ?? "",
      stocked: !!formData.get("stocked"),
      name: formData.get("name")?.toString() ?? ""
    }
    setProducts([...products, newProduct]);
  }

  function deleteHandler(name: string): void {
    const newProducts = [...products];
    const index = newProducts.findIndex(product => product.name === name);
    if (index !== -1) newProducts.splice(index, 1);
    setProducts(newProducts);
  }

  return (
    <div className="table">
      <form onSubmit={(e) => {
        e.preventDefault();
        addHandler(e.target as HTMLFormElement);
      }}>
        <input name="category" placeholder='category' />
        <input name="price" placeholder='price' />
        <input name="name" placeholder='name' />
        <div className='stocked'>
          <label>stocked</label>
          <input type="checkbox" name="stocked" defaultChecked={true} />
        </div>
        <button type="submit">Add</button>
      </form>
      <SearchBar setFilteredTextProp={setFilteredText} setCheckmarkProp={setCheckmark} />
      <ProductTable products={products} filteredText={filteredText} checkmark={checkmark} deleteHandler={deleteHandler} />
    </div>
  );
}

function SearchBar(props: SearchBarProps) {
  const { setFilteredTextProp, setCheckmarkProp } = props;
  return (
    <>
      <input type="search" onChange={(e) => setFilteredTextProp(e.target.value)} />
      <div>
        <input type="checkbox" onChange={(e) => setCheckmarkProp(e.target.checked)} />
        <p> Only show products in stock</p>
      </div>
    </>
  );
}

function ProductTable({ products, filteredText, checkmark, deleteHandler }: ProductTableProps) {
  const filteredProducts = products.filter((product) => {
    const isCategory = product.category.startsWith(filteredText);
    return checkmark ? product.stocked && isCategory : isCategory;
  }).sort((a, b) => {
    if (a.name === b.name) return 0;
    return a.name < b.name ? -1 : 1;
  });
  const filteredProductsObj = transformToProductsByCat(filteredProducts);
  const categories = Object.keys(filteredProductsObj).sort();
  return (
    <table className="table">
      <thead>
        <tr className="row">
          <th> Name </th>
          <th> Price </th>
        </tr>
      </thead>
      {categories.map((categoryKey, index) => {
        return (
          <React.Fragment key={index}>
            <thead>
              <tr>{<ProductCategory category={categoryKey} />}</tr>
            </thead>
            <tbody>
              {filteredProductsObj[categoryKey].map((product, index) => {
                return (
                  <tr className="row" key={index}>
                    <ProductRow name={product.name} price={product.price} deleteHandler={deleteHandler} />
                  </tr>
                );
              })}
            </tbody>
          </React.Fragment>
        );
      })}
    </table>
  );
}

function ProductCategory({ category }: { category: string }) {
  return <th colSpan={2}>{category}</th>;
}

function ProductRow({ name, price, deleteHandler }: ProductRowProps) {
  return (
    <>
      <td>{name}</td>
      <td>{price}</td>
      <button onClick={() => deleteHandler(name)}>Delete</button>
    </>
  );
}

export function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
