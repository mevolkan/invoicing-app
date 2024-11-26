import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceForm from "./InvoiceForm";

interface Invoice {
  [x: string]: unknown;
  id: number;
  name: string;
  senderEmail: string;
  recipientEmail: string;
  date: string;
  dueDate: string;
  shippingAddress: string;
  invoiceNote: string;
  description: string;
  qty: number;
  rate: number;
  total: number;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const fetchInvoices = () => {
      fetch("http://localhost:1337/api/invoices")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Fetched invoices:", data);
          if (Array.isArray(data.data)) {
            setInvoices(data.data);
          } else {
            console.error("Fetched data is not an array");
          }
        })
        .catch((error) => {
          console.error("Error fetching invoices:", error);
        });
    };

    fetchInvoices();
  }, []);

  const handleOpenInvoiceForm = () => {
    setSelectedInvoice(null);
    setIsInvoiceFormOpen(true);
  };

  const handleCloseInvoiceForm = () => {
    setSelectedInvoice(null);
    setIsInvoiceFormOpen(false);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    console.log("Invoice being edited:", invoice);
    setSelectedInvoice(invoice);
    setIsInvoiceFormOpen(true);
  };

  const handleDeleteInvoice = async (documentId: string) => {
    try {
      alert("Are you sure you want to delete this invoice?");
      await axios.delete(`http://localhost:1337/api/invoices/${documentId}`);
      setInvoices(invoices.filter((invoice) => invoice.documentId !== documentId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-[65%] flex flex-row justify-between py-4">
        <h2 className="text-3xl text-gray-700 font-medium">INVOICE</h2>
        <button
          onClick={handleOpenInvoiceForm}
          className="bg-green-500 p-2 w-30 text-white rounded-lg"
        >
          Create invoice
        </button>
      </section>

      {isInvoiceFormOpen && (
        <InvoiceForm
          onClose={handleCloseInvoiceForm}
          setInvoices={setInvoices}
          selectedInvoice={selectedInvoice}
        />
      )}

      {invoices.length === 0 ? (
        <p>No invoice yet.</p>
      ) : (
        <div className="w-[70%]">
          <div className="px-5 py-5 mx-auto">
            {invoices.map((invoice) => (
              <div  key={invoice.documentId}>
                <div
                  className="flex flex-wrap border-t-2 border-b-2 border-gray-200 border-opacity-60"
                  key={invoice.documentId}
                >
                  <div className="lg:w-1/3 md:w-full px-8 py-6 border-opacity-60">
                    <div>
                      <h2 className="text-base text-gray-900 font-medium mb-1">
                        Issued:
                      </h2>
                      <p className="leading-relaxed text-sm mb-4">
                        {invoice.date}
                      </p>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-base text-gray-900 font-medium">
                        Due:
                      </h2>
                      <p className="leading-relaxed text-sm mb-4">
                        {invoice.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-1/3 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                    <h2 className="text-base text-gray-900 font-medium mb-2">
                      Billed To:
                    </h2>
                    <div className="">
                      <h2 className=" text-gray-900 text-sm mb-1 font-medium">
                        Recipient's Email
                      </h2>
                      <p className="leading-relaxed text-sm mb-5">
                        {invoice.recipientEmail}
                      </p>
                    </div>

                    <div>
                      <h2 className=" text-gray-900 text-sm mb-1 font-medium">
                        Shipping Address
                      </h2>
                      <p className="leading-relaxed text-sm mb-4">
                        {invoice.shippingAddress}
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-1/3 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                    <h2 className="text-base text-gray-900 font-medium mb-2">
                      From:
                    </h2>
                    <div className="">
                      <h2 className=" text-gray-900 text-sm mb-1 font-medium">
                        Sender's Name
                      </h2>
                      <p className="leading-relaxed text-sm mb-5">
                        {invoice.name}
                      </p>
                    </div>

                    <div>
                      <h2 className=" text-gray-900 text-sm mb-1 font-medium">
                        Sender's Email
                      </h2>
                      <p className="leading-relaxed text-sm mb-4">
                        {invoice.senderEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full px-5 py-12 mx-auto">
                  <div className="flex flex-row justify-between border-b-2 border-gray-300">
                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Invoice Item
                      </h2>
                    </div>

                    <div className="flex flex-row mb-2">
                      <p className="ml-2 text-lg font-medium text-gray-800">
                        Qty
                      </p>
                      <p className="ml-[6rem] text-lg font-medium text-gray-800">
                        Rate
                      </p>
                      <p className="ml-[6rem] text-lg font-medium text-gray-800">
                        Total
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between mt-4">
                    <div>
                      <h2 className="text-base text-gray-700 mb-4">
                        {invoice.description}
                      </h2>
                    </div>

                    <div className="flex flex-row mb-4">
                      <p className="ml-2 text-base text-gray-800">
                        {invoice.qty}
                      </p>
                      <p className="ml-[6rem] text-base text-gray-800">
                        ${invoice.rate}
                      </p>
                      <p className="ml-[6rem] text-base text-gray-800">
                        ${invoice.total}
                      </p>
                    </div>
                  </div>

                  <div className="grid justify-end pt-[2.5rem]">
                    <div className="flex flex-row justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-700 mb-4">
                          Tax (0%)
                        </h2>
                      </div>

                      <div className="flex flex-row">
                        <p className="ml-[10rem] text-base text-gray-800">
                          0.00
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between border-y-2 border-green-400">
                      <div className="pt-4">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">
                          Amount due:
                        </h2>
                      </div>

                      <div className="flex flex-row pt-4">
                        <p className="ml-[10rem] text-lg font-medium text-gray-800">
                          ${invoice.total}.00
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between w-full mt-1">
                  <div>
                    <button className="bg-blue-500 px-2 py-2 rounded text-white hover:bg-blue-600">
                      Download invoice
                    </button>

                    <button
                      className="bg-green-500 px-2 py-2 rounded text-white hover:bg-green-600 ml-4"
                      onClick={() => handleEditInvoice(invoice)}
                    >
                      Edit invoice
                    </button>
                  </div>

                  <div className="flex justify-end bg-red-400 px-2 py-2 rounded text-white hover:bg-red-500">
                    <button onClick={() => handleDeleteInvoice(invoice.id)}>
                      Delete invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;