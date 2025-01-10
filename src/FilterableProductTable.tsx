import React, { useState } from 'react';

interface Product {
    category: string;
    price: string;
    stocked: boolean;
    name: string;
}

/*interface FilterableProductProps {
    products: Product[];
}
*/
interface ProductTableProps {
    products: Product[];
    filteredText: string;
    checkmark: boolean;
}

interface SearchBarProps {
    setFilteredTextProp: React.Dispatch<React.SetStateAction<string>>;
    setCheckmarkProp: React.Dispatch<React.SetStateAction<boolean>>;
}

function FilterableProductTable({ products }: ProductTableProps) {
    const [filteredText, setFilteredText] = useState("");
    const [checkmark, setCheckmark] = useState(false);
    return (
        <div className='table'>
            <SearchBar setFilteredTextProp={searchValue => {
                console.log(searchValue);
                setFilteredText(searchValue)
            }} setCheckmarkProp={(checkmark) => {
                console.log(checkmark);
                setCheckmark(checkmark)
            }} />
            <ProductTable products={products} filteredText={filteredText} checkmark={checkmark} />
        </div>
    )
}
//{product: Procduct[]}
function SearchBar(props: SearchBarProps) {
    const { setFilteredTextProp, setCheckmarkProp } = props;
    return (
        <>
            <input type="search" onChange={(e) => setFilteredTextProp(e.target.value)} />
            <div>
                <input type="checkbox" onChange={(e) => setCheckmarkProp(e.target.checked)} />

                <label> Only show products in stock</label>
            </div>
        </>
    )
}
function ProductTable(props: ProductTableProps) {
    const { products, filteredText, checkmark } = props;
    interface GroupProducts {
        [key: string]: Product[];
    }
    const groupProducts: GroupProducts = {};
    products.forEach(product => {
        if (product.category in groupProducts) {
            groupProducts[product.category].push(product);
        } else {
            groupProducts[product.category] = [product];
        }
    })
    let filteredProducts = groupProducts;
    console.table(groupProducts);
    if (filteredText !== "") {
        filteredProducts = {};
        for (const category in groupProducts) {
            if (category.startsWith(filteredText)) {
                let categoryProduct = groupProducts[category];
                filteredProducts[category] = categoryProduct;
            }
        }
    }
    if (checkmark) {
        for (const category in filteredProducts) {
            filteredProducts[category] = filteredProducts[category].filter(product => product.stocked);
        }
    }
    const categories = Object.keys(filteredProducts);
    const productsElements = categories.map((categoryKey, index) => {
        const catElem = <ProductCategory category={categoryKey} />;
        const productsElem = filteredProducts[categoryKey].map((product, index) => {
            return (
                <tr className="row" key={index}>
                    <ProductRow name={product.name} price={product.price} />
                </tr>
            )
        });
        return (
            <React.Fragment key={index}>
                <thead><tr>{catElem}</tr></thead>
                <tbody>
                    {productsElem}
                </tbody>
            </React.Fragment>
        )
    })

    return (
        <table className="table">
            <thead>
                <tr className="row">
                    <th> Name </th>
                    <th> Price </th>
                </tr>
            </thead>
            {productsElements}
        </table>
    )
}

function ProductCategory({ category }: { category: string }) {
    return (
        <th colSpan={2}>{category}</th>
    )
}

function ProductRow({ name, price }: { name: string, price: string }) {
    return (
        <>
            <td>{name}</td>
            <td>{price}</td>
        </>
    )
}

const PRODUCTS = [
    { category: "Vegetables", price: "$2", stocked: true, name: "Green Beans" },
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Snacks", price: "$5", stocked: true, name: "Popcorn" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];
// {fruits: [{}...],
//  vegetables: [{}..]}
export function App() {
    return <FilterableProductTable products={PRODUCTS} />;
}