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
}

interface SearchBarProps {
  setFilteredTextProp: React.Dispatch<React.SetStateAction<string>>;
  setCheckmarkProp: React.Dispatch<React.SetStateAction<boolean>>;
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

function FilterableProductTable(products: Product[]) {
  const [filteredText, setFilteredText] = useState('');
  const [checkmark, setCheckmark] = useState(false);
  return (
    <div className="table">
      <SearchBar setFilteredTextProp={setFilteredText} setCheckmarkProp={setCheckmark} />
      <ProductTable products={products} filteredText={filteredText} checkmark={checkmark} />
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

function ProductTable(props: ProductTableProps) {
  const { products, filteredText, checkmark } = props;
  const filteredProducts = products.filter((product) => {
    const isCategory = product.category.startsWith(filteredText);
    return checkmark ? product.stocked && isCategory : isCategory;
  });
  const filteredProductsObj = transformToProductsByCat(filteredProducts);
  const categories = Object.keys(filteredProductsObj);
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
                    <ProductRow name={product.name} price={product.price} />
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

function ProductRow({ name, price }: { name: string; price: string }) {
  return (
    <>
      <td>{name}</td>
      <td>{price}</td>
    </>
  );
}

export function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
