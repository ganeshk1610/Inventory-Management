// import { Fragment, useRef, useState, useContext } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import AuthContext from "../AuthContext";
// import ReactDOM from 'react-dom/client';

// export default function AddStore() {
//   const authContext = useContext(AuthContext);
//   const [form, setForm] = useState({
//     userId: authContext.user,
//     brand: "",
//     category: "",
//     customCategory: "",
//     description: "",
//     item: "",
//     batchNumber: "",
//   });
//   const [categories, setCategories] = useState([
//     "Electronics",
//     "Groceries",
//     "Wholesale",
//     "SuperMart",
//     "Phones",
//     "Beverages",
//     "Snacks",
//     "Personal Care",
//     "Others",
//   ]);

//   const handleInputChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCategoryChange = (e) => {
//     const selectedCategory = e.target.value;
//     setForm({
//       ...form,
//       category: selectedCategory,
//       customCategory: selectedCategory === "Others" ? "" : form.customCategory,
//     });
//   };

//   const addCategory = () => {
//     if (form.category === "Others" && form.customCategory) {
//       setCategories((prev) => [...prev, form.customCategory]);
//       setForm({ ...form, category: form.customCategory });
//     }
//   };

//   const addProduct = () => {
//     if (
//       !form.brand ||
//       !form.category ||
//       (!form.customCategory && form.category === "Others") ||
//       !form.description ||
//       !form.item ||
//       !form.batchNumber
//     ) {
//       alert("Please fill out all fields.");
//       return;
//     }
  
//     fetch("http://localhost:4000/api/store/add", {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify(form),
//     })
//       .then((result) => {
//         if (!result.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return result.json();
//       })
//       .then((data) => {
//         alert("Category added successfully.");
//         setOpen(false);
//         // Redirect to the manage store page
//         window.location.href = "http://localhost:3000/category";
//       })
//       .catch((err) => {
//         console.error("There was an issue with the addProduct request:", err);
//         alert("Failed to add Category. Please try again.");
//       });
//   };
  
//   const [open, setOpen] = useState(true);
//   const cancelButtonRef = useRef(null);

//   return (
//     <Transition.Root show={open} as={Fragment}>
//       <Dialog
//         as="div"
//         className="relative z-10"
//         initialFocus={cancelButtonRef}
//         onClose={() => setOpen(false)}
//       >
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//         </Transition.Child>

//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                       <PlusIcon
//                         className="h-6 w-6 text-blue-400"
//                         aria-hidden="true"
//                       />
//                     </div>
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                       <Dialog.Title
//                         as="h3"
//                         className="text-lg font-semibold leading-6 text-gray-900"
//                       >
//                         Add Category
//                       </Dialog.Title>
//                       <form>
//                         <div className="grid gap-4 mb-4 sm:grid-cols-2">
//                           <div>
//                             <label
//                               htmlFor="brand"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Brand
//                             </label>
//                             <input
//                               type="text"
//                               name="brand"
//                               id="brand"
//                               value={form.brand}
//                               onChange={handleInputChange}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                               placeholder="Enter Brand Name"
//                               required
//                             />
//                           </div>
//                           <div>
//                             <label
//                               htmlFor="item"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Item
//                             </label>
//                             <input
//                               type="text"
//                               name="item"
//                               id="item"
//                               value={form.item}
//                               onChange={handleInputChange}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
//                               placeholder="Enter Item Name"
//                               required
//                             />
//                           </div>
//                           <div>
//                             <label
//                               htmlFor="category"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Category
//                             </label>
//                             <select
//                               id="category"
//                               name="category"
//                               value={form.category}
//                               onChange={handleCategoryChange}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
//                               required
//                             >
//                               <option value="" disabled>
//                                 Select Category
//                               </option>
//                               {categories.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                   {cat}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           {form.category === "Others" && (
//                             <div>
//                               <label
//                                 htmlFor="customCategory"
//                                 className="block mb-2 text-sm font-medium text-gray-900"
//                               >
//                                 Custom Category
//                               </label>
//                               <input
//                                 type="text"
//                                 id="customCategory"
//                                 name="customCategory"
//                                 value={form.customCategory}
//                                 onChange={handleInputChange}
//                                 onBlur={addCategory}
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
//                                 placeholder="Enter Custom Category"
//                                 required
//                               />
//                             </div>
//                           )}
//                           <div>
//                             <label
//                               htmlFor="batchNumber"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Batch Number
//                             </label>
//                             <input
//                               type="text"
//                               id="batchNumber"
//                               name="batchNumber"
//                               value={form.batchNumber}
//                               onChange={handleInputChange}
//                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
//                               placeholder="Enter Batch Number"
//                               required
//                             />
//                           </div>
//                           <div className="sm:col-span-2">
//                             <label
//                               htmlFor="description"
//                               className="block mb-2 text-sm font-medium text-gray-900"
//                             >
//                               Description
//                             </label>
//                             <textarea
//                               id="description"
//                               name="description"
//                               rows="5"
//                               className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
//                               placeholder="Write Description..."
//                               value={form.description}
//                               onChange={handleInputChange}
//                               required
//                             />
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                   <button
//                     type="button"
//                     className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
//                     onClick={addProduct}
//                   >
//                     Add Category
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
//                     onClick={() => setOpen(false)}
//                     ref={cancelButtonRef}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }
