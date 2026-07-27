import { Box, Fab, Stack } from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { useEffect, useMemo, useState } from "react";

import ProductSearch from "../../components/product/ProductSearch";
import CategoryScroller from "../../components/product/CategoryScroller";
import ProductSort from "../../components/product/ProductSort";
import ProductCount from "../../components/product/ProductCount";
import ProductFilterDrawer from "../../components/product/ProductFilterDrawer";
import ProductSkeleton from "../../components/product/ProductSkeleton";

import FeaturedSection from "../../components/product/FeaturedSection";
import FlashSaleSection from "../../components/product/FlashSaleSection";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import RecommendedSection from "../../components/product/RecommendedSection";

import InfiniteProductGrid from "../../components/product/InfiniteProductGrid";

import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

export default function Products() {

const [products,setProducts]=useState([]);
const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");

const [category,setCategory]=useState("All");

const [sort,setSort]=useState("latest");

const [drawerOpen,setDrawerOpen]=useState(false);

const [filters,setFilters]=useState({

price:[0,500000],

location:"All",

condition:"All",

verified:false,

freeDelivery:false,

inStock:false,

});

useEffect(()=>{

setLoading(true);

productService
.list({sort})
.then(res=>setProducts(normalizeList(res)))
.catch(()=>setProducts([]))
.finally(()=>setLoading(false));

},[sort]);

const categories=useMemo(()=>{

const list=[
...new Set(
products
.map(p=>p.category)
.filter(Boolean)
)
];

return ["All",...list];

},[products]);

const filteredProducts=useMemo(()=>{

return products.filter(product=>{

const matchesSearch=

(product.name||product.title||"")

.toLowerCase()

.includes(search.toLowerCase());

const matchesCategory=

category==="All"

||

product.category===category;

const matchesPrice=

Number(product.price)>=filters.price[0]

&&

Number(product.price)<=filters.price[1];

const matchesLocation=

filters.location==="All"

||

product.location===filters.location;

const matchesCondition=

filters.condition==="All"

||

product.condition===filters.condition;

const matchesVerified=

!filters.verified

||

product.verified;

const matchesStock=

!filters.inStock

||

product.stock>0;

return(

matchesSearch &&

matchesCategory &&

matchesPrice &&

matchesLocation &&

matchesCondition &&

matchesVerified &&

matchesStock

);

});

},[
products,
search,
category,
filters,
]);

if(loading){

return(

<Box p={2}>

<ProductSkeleton count={8}/>

</Box>

);

}

return(

<Box
sx={{
px:{xs:1,sm:2},
py:2,
}}
>

<Stack spacing={3}>

<ProductSearch

value={search}

onChange={setSearch}

/>

<CategoryScroller

categories={categories}

selected={category}

onSelect={setCategory}

/>

<Box

display="flex"

justifyContent="space-between"

alignItems="center"

flexWrap="wrap"

gap={2}

>

<ProductCount

count={filteredProducts.length}

total={products.length}

category={category}

/>

<ProductSort

value={sort}

onChange={setSort}

/>

</Box>

<FeaturedSection

products={products.filter(

p=>p.promoted

)}

onSeeAll={()=>{}}

/>

<FlashSaleSection

products={products.filter(

p=>p.flashSale

)}

countdown="02:18:45"

onSeeAll={()=>{}}

/>

<NewArrivalsSection

products={[...products]

.sort(

(a,b)=>

new Date(b.createdAt)-

new Date(a.createdAt)

)

.slice(0,10)}

onSeeAll={()=>{}}

/>

<RecommendedSection

products={[...products]

.sort(

(a,b)=>

(b.views||0)-

(a.views||0)

)

.slice(0,10)}

onSeeAll={()=>{}}

/>

<InfiniteProductGrid

products={filteredProducts}

loading={false}

hasMore={false}

/>

</Stack>

<Fab

color="primary"

onClick={()=>

setDrawerOpen(true)

}

sx={{

position:"fixed",

bottom:24,

right:24,

}}

>

<FilterAltRoundedIcon/>

</Fab>

<ProductFilterDrawer

open={drawerOpen}

onClose={()=>

setDrawerOpen(false)

}

filters={filters}

onChange={setFilters}

onReset={()=>

setFilters({

price:[0,500000],

location:"All",

condition:"All",

verified:false,

freeDelivery:false,

inStock:false,

})

}

onApply={()=>{}}

/>

</Box>

);

}