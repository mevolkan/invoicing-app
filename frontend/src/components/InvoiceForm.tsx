"use client";
import React, { ChangeEvent, useEffect, useReducer, useState } from "react";
import axios from "axios";

interface InvoiceFormProps {
    onClose: () => void;
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
    selectedInvoice: Invoice | null;
}

interface Invoice {
    documentId: string;
    id: number;
    name: string;
    senderEmail: string;
    recipientEmail: string;
    shippingAddress: string;
    date: string;
    dueDate: string;
    invoiceNote: string;
    description: string;
    qty: number;
    rate: number;
    total: number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
    onClose,
    setInvoices,
    selectedInvoice,
}) => {
    const initialState = {
        name: "",
        senderEmail: "",
        recipientEmail: "",
        shippingAddress: "",
        date: "",
        dueDate: "",
        invoiceNote: "",
        description: "",
        qty: 0,
        rate: 0,
        total: 0,
    };

 
    function reducer(
        state = initialState,
        action: { field?: string; value?: any; type?: string }
    ) {
        switch (action.type) {
            case 'RESET':
                return initialState;
            case 'SET_FIELDS':
                return { ...state, ...action.value };
            case 'UPDATE_FIELD':
                return { ...state, [action.field!]: action.value };
            default:
                return state;
        }
    }

    const [formFields, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
        if (selectedInvoice) {
            // Create a new object with only the fields we want to set
            const invoiceData = {
                name: selectedInvoice.name||'',
                senderEmail: selectedInvoice.senderEmail||'',
                recipientEmail: selectedInvoice.recipientEmail||'',
                shippingAddress: selectedInvoice.shippingAddress||'',
                date: selectedInvoice.date||'',
                dueDate: selectedInvoice.dueDate||'',
                invoiceNote: selectedInvoice.invoiceNote||'',
                description: selectedInvoice.description||'',
                qty: selectedInvoice.qty||0,
                rate: selectedInvoice.rate||0,
                total: selectedInvoice.total||0,
            };

            // Use a single dispatch to set all fields at once
            dispatch({ type: 'SET_FIELDS', value: invoiceData });
        } else {
            // Reset to initial state
            dispatch({ type: 'RESET' });
        }
    }, [selectedInvoice]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_FIELD', field: name, value });
    };

    // Calculate total whenever qty or rate changes
    useEffect(() => {
        const total = (formFields.qty || 0) * (formFields.rate || 0);
        if (total !== formFields.total) {
            dispatch({ type: 'UPDATE_FIELD', field: 'total', value: total });
        }
    }, [formFields.qty, formFields.rate, formFields.total]);

    const handleSendInvoice = async () => {
        try {
            const {
                name,
                senderEmail,
                recipientEmail,
                date,
                dueDate,
                shippingAddress,
                invoiceNote,
                description,
                qty,
                rate,
                total,
            } = formFields;

            if (selectedInvoice) {
                // Update an existing invoice
                const { data } = await axios.put(
                    `http://localhost:1337/api/invoices/${selectedInvoice.documentId}`,
                    {
                        data: {
                            name,
                            senderEmail,
                            recipientEmail,
                            shippingAddress,
                            dueDate,
                            date,
                            invoiceNote,
                            description,
                            qty,
                            rate,
                            total,
                        },
                    },
                );

                setInvoices((prev) =>
                    prev.map((inv) =>
                        inv.documentId === selectedInvoice.documentId ? { ...inv, ...formFields } : inv,
                    ),
                );
            } else {
                // Create a new invoice
                const { data } = await axios.post(
                    "http://localhost:1337/api/invoices",
                    {
                        data: {
                            name,
                            senderEmail,
                            recipientEmail,
                            shippingAddress,
                            dueDate,
                            date,
                            invoiceNote,
                            description,
                            qty,
                            rate,
                            total,
                        },
                    },
                );

                setInvoices((prev) => [...prev, data.data]);
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <main className="fixed top-0 z-50 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
                <section className="relative lg:px-10 px-6 py-8 lg:mt-8 lg:w-[60%] bg-white shadow-md rounded px-8 pt-2 pb-8 mb-4">
                    <form className="pt-4">
                        <h2 className="text-lg font-medium mb-4">
                            {selectedInvoice ? "Edit Invoice" : "Create Invoice"}
                        </h2>
                        <button
                            className="absolute top-2 right-8 font-bold text-black cursor-pointer text-2xl"
                            onClick={onClose}
                        >
                            &times;
                        </button>

                        <div className="mb-4 flex flex-row justify-between">
                            <div className="flex flex-col w-[30%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="name"
                                >
                                    Your name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Sender's name"
                                    onChange={handleInputChange}
                                    value={formFields.name}
                                    required
                                />
                            </div>

                            <div className="flex flex-col w-[30%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="senderEmail"
                                >
                                    Your email address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="senderEmail"
                                    name="senderEmail"
                                    type="email"
                                    placeholder="Sender's email"
                                    onChange={handleInputChange}
                                    value={formFields.senderEmail}
                                    required
                                />
                            </div>

                            <div className="flex flex-col w-[30%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="recipientEmail"
                                >
                                    Recipient's Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="recipientEmail"
                                    name="recipientEmail"
                                    type="email"
                                    placeholder="Client's email address"
                                    onChange={handleInputChange}
                                    value={formFields.recipientEmail}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4 flex flex-row justify-between">
                            <div className="flex flex-col w-[45%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="date"
                                >
                                    Date
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="date"
                                    name="date"
                                    type="date"
                                    onChange={handleInputChange}
                                    value={formFields.date}
                                    required
                                />
                            </div>

                            <div className="flex flex-col w-[45%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="dueDate"
                                >
                                    Due Date
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="dueDate"
                                    name="dueDate"
                                    type="date"
                                    onChange={handleInputChange}
                                    value={formFields.dueDate}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4 flex flex-row justify-between">
                            <div className="flex flex-col w-[45%]">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="shippingAddress"
                                >
                                    Shipping Address
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="shippingAddress"
                                    name="shippingAddress"
                                    placeholder="Office address of recipient"
                                    onChange={handleInputChange}
                                    value={formFields.shippingAddress}
                                    required
                                />
                            </div>

                            <div className="flex flex-col w-[45%]">
                                <label
                                    htmlFor="invoiceNote"
                                    className="block text-gray-700 text-sm font-bold mb-2 w-full"
                                >
                                    Invoice Note
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="invoiceNote"
                                    name="invoiceNote"
                                    placeholder="Account details"
                                    onChange={handleInputChange}
                                    value={formFields.invoiceNote}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <label
                                htmlFor="description"
                                className="block text-gray-700 text-sm font-bold mb-2 w-full mr-5"
                            >
                                Invoice Item
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="description"
                                    name="description"
                                    type="text"
                                    placeholder="Reason for invoice"
                                    onChange={handleInputChange}
                                    value={formFields.description}
                                    required
                                />
                            </label>

                            <label
                                htmlFor="qty"
                                className="block text-gray-700 text-sm font-bold mb-2 w-full mr-5"
                            >
                                Quantity
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="qty"
                                    name="qty"
                                    type="number"
                                    onChange={handleInputChange}
                                    value={formFields.qty}
                                    required
                                />
                            </label>

                            <label
                                htmlFor="rate"
                                className="block text-gray-700 text-sm font-bold mb-2 w-full mr-5"
                            >
                                Rate
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="rate"
                                    name="rate"
                                    type="number"
                                    onChange={handleInputChange}
                                    value={formFields.rate}
                                    required
                                />
                            </label>

                            <div className="block text-gray-700 text-sm font-bold mb-2 w-full mr-5">
                                <label>Total</label>
                                <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight">
                                    {formFields.total}
                                </div>
                            </div>
                        </div>

                        <hr className="mt-5 border-1" />

                        <div className="mt-4 flex justify-center">
                            <button
                                type="button"
                                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                onClick={handleSendInvoice}
                            >
                                {selectedInvoice ? "Update Invoice" : "Send Invoice"}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default InvoiceForm;