import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { Checkbox, Radio } from "antd";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    // const [cart,setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // get all cate
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.categories);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllCategory();
        // getTotal();
    }, []);

    //get all Product
    // const getAllProducts = async () => {
    //     try {
    //         setLoading(true);
    //         const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
    //         setLoading(false);
    //         setProducts(data.products);
    //     } catch (error) {
    //         setLoading(false);
    //         console.log(error);
    //     }
    // }

    // filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };
    // useEffect(() => {
    //     if (!checked.length || !radio.length) getAllProducts();
    // }, [checked.length, radio.length]);

    // useEffect(() => {
    //     if (checked.length || radio.length) filterProduct();
    // }, [checked, radio]);

    // get filter product
    // const filterProduct = async () => {
    //     try {
    //         const { data } = await axios.post("/api/v1/product/product-filters", { checked, radio });
    //         setProducts(data?.products);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    return (
        <Layout title={"All Product Best offers"}>
            <img
                src="/images/banner.png"
                className="banner-img"
                alt="bannerimage"
                width={"100%"}
            />
            <div className="container-fluid row mt-3 home-page">
                <div className="col-md-3 filters">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => {
                                }}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                </div>
                <div className="col-md-9">
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">
                        <h1>Product</h1>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;