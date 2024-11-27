import React, { useState, useEffect, useContext, useCallback } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([
    "Electronics",
    "Groceries",
    "Wholesale",
    "SuperMart",
    "Phones",
    "Beverages",
    "Snacks",
    "Personal Care",
    "Others",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  // Fetching Data of All Sales
  const fetchSalesData = useCallback(() => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  }, [authContext.user]);

  // Fetching Data of All Products
  const fetchProductsData = useCallback(() => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      // .catch((err) => console.log(err));
  }, [authContext.user]);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
  }, [fetchSalesData, fetchProductsData, updatePage]);

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Delete Sale
  const deleteSale = (id) => {
    fetch(`http://localhost:4000/api/sales/delete/${id}`, {
      method: "DELETE",
    })
      .then((result) => {
        alert("Sale Deleted");
        handlePageUpdate();
      })
      .catch((err) => console.log(err));
  };
  


  // Filtered Sales based on Search Term
  const filteredSales = sales.filter((sale) => {
    return (
      sale.ProductID?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.CategoryID?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.SaleDate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            categories={categories}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        {/* Search Bar */}
        <div className="flex justify-between pt-5 pb-3 px-3">
          <input
            type="text"
            placeholder="Search by Product, Category or Date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded ml-2"
            onClick={addSaleModalSetting}
          >
            Add Sales
          </button>
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Sales</span>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Category
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Stock Sold
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Sales Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Total Sale Amount
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((element) => (
                <tr key={element._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                    {element.ProductID?.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.CategoryID?.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.StockSold}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {element.SaleDate}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    ₹{element.TotalSaleAmount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 text-xs rounded"
                      onClick={() => deleteSale(element._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold p-1 text-xs rounded ml-2"
                      onClick={() => {
                        // Handle Edit Sale
                        setShowSaleModal(true);
                        // Set sale data to edit
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
