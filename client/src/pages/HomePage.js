import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";

const HomePage = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout title={"Best offers"}>
            <div className="row mt-3">
                <div className="col-md-3">
                    <h4 className="text-center">Filter By Category</h4>
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