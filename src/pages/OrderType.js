// src/pages/OrderType.js

import { useEffect, useState } from 'react';
import CardAdd from '../components/CardAdd';
import EditCard from '../components/EditCard';
import HeadingText from '../components/HeadingText';
import InputField from '../components/InputField';
import Popup from '../components/Popup';
import './Brand.css';
import GradientButton from '../components/GradientButton';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import SelectInput from '../components/SelectInput';
import SearchFilterBar from '../components/SearchFilterBar';
import { toast } from 'react-toastify';
import axios from 'axios';
import useFetchBrands from '../hooks/useFetchBrands';
import useFetchOutlets from '../hooks/useFetchOutlets';

const category = [
    { label: "Pickup", value: "pickup" },
    { label: "Dine-in", value: "dine-in" },
    { label: "Quick Service", value: "quick-service" },
    { label: "Delivery", value: "delivery" },
    { label: "Third Party", value: "third-party" },
];

const OrderType = () => {
    const { brands } = useFetchBrands();
    const { outlets } = useFetchOutlets();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [orderTypes, setOrderTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filteredOutlets, setFilteredOutlets] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [applyOnAllOutlets, setApplyOnAllOutlets] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [orderTypeInfo, setOrderTypeInfo] = useState({
        _id: '',
        name: '',
        category: '',
        status: 'active',
        apply_on_all_outlets: false,
        brand_id: '',
        outlet_id: '',
    });

    useEffect(() => {
        fetchOrderTypes();
    }, []);

    const fetchOrderTypes = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/order-type/accessible", {
                withCredentials: true,
            });
            setOrderTypes(response.data.orderTypes);
        } catch (error) {
            console.error("Error fetching order types:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch order types");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setOrderTypeInfo({
            _id: '',
            name: '',
            category: '',
            status: 'active',
            apply_on_all_outlets: false,
            brand_id: '',
            outlet_id: '',
        });
        setFilteredOutlets([]);
        setSelectedBrand(null);
        setSelectedOutlet(null);
        setSelectedCategory(null);
        setApplyOnAllOutlets(false);
        setShowPopup(true);
    };

    const handleEdit = (type) => {
        setIsEditing(true);
        const brand = brands.find(b => b._id === type.brand_id?._id);
        const outletOptions = outlets.filter(outlet => outlet.brand_id === brand?._id);
        const outlet = outlets.find(outlet => outlet._id === type.outlet_id?._id);
        const categoryOption = category.find(cat => cat.value === type.category);

        setOrderTypeInfo({
            _id: type._id,
            name: type.name,
            status: type.status,
            apply_on_all_outlets: type.apply_on_all_outlets,
            brand_id: type.brand_id?._id || '',
            outlet_id: type.outlet_id?._id || '',
        });
        setSelectedBrand(brand);
        setFilteredOutlets(outletOptions);
        setSelectedOutlet(outlet ? { label: outlet.name, value: outlet._id } : null);
        setSelectedCategory(categoryOption);
        setApplyOnAllOutlets(type.apply_on_all_outlets);
        setShowPopup(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderTypeInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleBrandSelection = (brand) => {
        setSelectedBrand(brand);
        const filtered = outlets.filter(outlet => outlet.brand_id === brand._id);
        setFilteredOutlets(filtered);
        if (filtered.length === 0) {
            toast.error("Selected brand has no outlets.");
            setApplyOnAllOutlets(false);
        }
    };

    const handleSave = async () => {
        const payload = {
            name: orderTypeInfo.name,
            category: selectedCategory?.value || '',
            status: orderTypeInfo.status,
            apply_on_all_outlets: applyOnAllOutlets,
            brand_id: selectedBrand?._id || '',
            outlet_id: (selectedOutlet && !applyOnAllOutlets) ? selectedOutlet.value : null,
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5001/api/order-type/update/${orderTypeInfo._id}`, payload, {
                    withCredentials: true,
                });
                toast.success("Order type updated successfully!");
            } else {
                await axios.post("http://localhost:5001/api/order-type/create", payload, {
                    withCredentials: true,
                });
                toast.success("Order type created successfully!");
            }
            fetchOrderTypes();
            setShowPopup(false);
        } catch (error) {
            console.error("Error saving order type:", error);
            toast.error(error?.response?.data?.message || "Failed to save order type");
        }
    };

    const filteredOrderTypes = orderTypes.filter((orderType) => {
        const searchLower = search.toLowerCase();
        const statusLower = status?.toLowerCase();

        // Check if order type name matches
        const matchesName = orderType.name?.toLowerCase().includes(searchLower);

        // Check if order type category matches
        const matchesCategory = orderType.category?.toLowerCase().includes(searchLower);

        // Check if associated brand name or short_name matches
        const matchesBrand = orderType.brand_id &&
            (
                orderType.brand_id.name?.toLowerCase().includes(searchLower) ||
                orderType.brand_id.short_name?.toLowerCase().includes(searchLower)
            );

        // Check if associated outlet name matches
        const matchesOutlet = orderType.outlet_id &&
            orderType.outlet_id.name?.toLowerCase().includes(searchLower);

        const matchesSearch = matchesName || matchesCategory || matchesBrand || matchesOutlet;

        // Check if order type status matches (or no status filter applied)
        const matchesStatus = !status || orderType.status?.toLowerCase() === statusLower;

        return matchesSearch && matchesStatus;
    });


    return (
        <>
            <HeadingText>Order Type</HeadingText>
            <SearchFilterBar
                placeholder="Search Brand, Outlet, Order Type..."
                searchValue={search}
                onSearchChange={setSearch}
                statusValue={status}
                onStatusChange={setStatus}
            />
            <div className="cards-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    filteredOrderTypes.map(type => (
                        <EditCard
                            key={type._id}
                            title={type.name}
                            role={type.outlet_id?.name || "All Outlets"}
                            status={type.status}
                            handleEdit={() => handleEdit(type)}
                        />
                    ))
                )}
                <CardAdd handleAdd={handleAdd} />
            </div>

            {showPopup && (
                <Popup title="Order Type" closePopup={() => setShowPopup(false)}>
                    <div className="inputs-container">
                        <SelectInput
                            label="Select Brand"
                            selectedOption={selectedBrand}
                            onChange={handleBrandSelection}
                            options={brands}
                        />
                        <InputField
                            label="Type Name"
                            name="name"
                            type="text"
                            value={orderTypeInfo.name}
                            onChange={handleInputChange}
                            placeholder="Enter Order Type name"
                        />
                        <SelectInput
                            label="Category"
                            selectedOption={selectedCategory}
                            onChange={setSelectedCategory}
                            options={category}
                        />
                        <SelectInput
                            disable={applyOnAllOutlets || !selectedBrand || filteredOutlets.length === 0}
                            label="Outlet"
                            selectedOption={selectedOutlet}
                            onChange={setSelectedOutlet}
                            options={filteredOutlets.map(o => ({ label: o.name, value: o._id }))}
                            placeholder={
                                !selectedBrand
                                    ? "Select a brand first"
                                    : applyOnAllOutlets
                                        ? "Disabled (All outlets)"
                                        : "Select outlet"
                            }
                        />
                        <div className="checkbox-container">
                            {isEditing && (
                                <Checkbox
                                    label="Active"
                                    checked={orderTypeInfo.status === 'active'}
                                    onChange={() =>
                                        setOrderTypeInfo(prev => ({
                                            ...prev,
                                            status: prev.status === 'active' ? 'inactive' : 'active',
                                        }))
                                    }
                                />
                            )}
                            <Checkbox
                                label="Apply on all outlets"
                                checked={applyOnAllOutlets}
                                disable={filteredOutlets.length === 0}
                                onChange={() => setApplyOnAllOutlets(!applyOnAllOutlets)}
                            />
                        </div>
                    </div>
                    <div className="action-btns-container">
                        <GradientButton clickAction={handleSave}>
                            {isEditing ? 'Update' : 'Create'}
                        </GradientButton>
                        <Button clickAction={() => setShowPopup(false)}>Close</Button>
                    </div>
                </Popup>
            )}
        </>
    );
};

export default OrderType;
