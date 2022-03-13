import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { Row, Col, Button } from "antd";
import { isEmpty } from "lodash";
// Firebase
import firebaseApp from "../../../../../../../../firebase";
import {
  getFirestore,
  collection,
  doc,
  orderBy,
  query as firebaseQuery,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
// Sub Components
import SpinnerColumn from "../../../../../../../misc/SpinnerColumn";
// ICONS
import { FaLock } from "react-icons/fa";
// STORE
import { store } from "../../../../../../../../store";
// UTILS
import { getUserAuthDetails } from "../../../../../../../../utils/GlobalStoreUtils";
import { filterUniqueObjects } from "../../../../../../../../utils/FormattingHelper";
import ProTable from "@ant-design/pro-table";
import Jumbotron from "components/bootstrap-legacy/jumbotron";

const InvoiceTable = ({ mode, teamId }) => {
  const params = new URLSearchParams(window.location.search);
  const autoRefresh = params.has("autoRefresh")
    ? params.get("autoRefresh") === "true"
    : false;
  const invoicesCount = 10; // Initial Count only | TODO - SAGAR - Replace with Bootstrap Pagination Table
  const mountedRef = useRef(true);
  //GLOBAL STATE
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  // Component State
  const [qs, setQs] = useState(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoices = (lastDoc) => {
    if (!mode) return;
    setIsLoading(true);
    let records = [];
    const collectionName =
      mode === "individual" ? "individualSubscriptions" : "teams";
    const documentName =
      mode === "individual" ? user.details.profile.uid : teamId;
    const db = getFirestore(firebaseApp);
    const collectionRef = collection(
      doc(collection(db, collectionName), documentName),
      "invoices"
    );
    // const collectionRef = firebase
    //   .firestore()
    //   .collection(collectionName)
    //   .doc(documentName)
    //   .collection("invoices");

    let query = firebaseQuery(
      collectionRef,
      orderBy("created", "desc"),
      startAfter(lastDoc || null),
      limit(invoicesCount)
    );
    // if (lastDoc) {
    //   query = query.startAfter(lastDoc);
    // }
    // query = query.limit(invoicesCount);
    getDocs(query).then((documentSnapshots) => {
      if (!mountedRef.current) return null;
      if (documentSnapshots.empty) {
        setReachedEnd(true);
      } else {
        documentSnapshots.forEach((doc) => {
          if (!doc.data().number || !doc.data().hosted_invoice_url) return;
          records.push({
            id: doc.id,
            total: Math.round(doc.data().total / 100).toFixed(2),
            subTotal: Math.round(doc.data().subTotal / 100).toFixed(2),
            tax: Math.round((doc.data().tax || 0) / 100).toFixed(2),
            amountPaid: Math.round(doc.data().amountPaid / 100).toFixed(2),
            created: new Date(doc.data().created * 1000).toDateString(),
            periodStart: new Date(doc.data().periodStart * 1000).toDateString(),
            periodEnd: new Date(doc.data().periodEnd * 1000).toDateString(),
            currency: doc.data().currency,
            status: doc.data().status,
            hosted_invoice_url: doc.data().hosted_invoice_url,
            number: doc.data().number,
            productStart: new Date(
              doc.data().productStart * 1000
            ).toDateString(),
            productEnd: new Date(doc.data().productEnd * 1000).toDateString(),
          });
        });
        if (records.length > 0) {
          setInvoices((invoices) => invoices.concat(records));
          setQs(documentSnapshots);
        }
      }
      setIsLoading(false);
    });
  };

  const stableFetchInvoices = useCallback(fetchInvoices, [
    mode,
    teamId,
    user.details.profile.uid,
  ]);

  const renderLoader = () => {
    return <SpinnerColumn customLoadingMessage="Loading your invoices" />;
  };

  const renderEmptyInvoice = () => {
    return (
      <Jumbotron style={{ background: "transparent" }} className="text-center">
        <h5>
          There are currently no invoices. If you have recently made a purchase,
          please wait a minute or two.
        </h5>
      </Jumbotron>
    );
  };

  const renderInvoiceStatus = (invoice) => {
    switch (invoice.status) {
      case "open":
        return (
          <React.Fragment>
            <Button
              className="btn-icon btn-3"
              color="primary"
              size="sm"
              type="button"
            >
              <span className="btn-inner--icon">
                <FaLock />
              </span>
              <span className="btn-inner--text">Pay now</span>
            </Button>
          </React.Fragment>
        );
      case "paid":
        return (
          <React.Fragment>
            <i className="bg-success" />
            <span className="font-weight-bold">Paid</span>
          </React.Fragment>
        );
      case "void":
        return (
          <React.Fragment>
            <i className="bg-danger" />
            <span className="font-weight-bold">Cancelled</span>
          </React.Fragment>
        );
      case "draft":
        return (
          <React.Fragment>
            <i className="bg-danger" />
            <span className="font-weight-bold">Pending</span>
          </React.Fragment>
        );
      case "uncollectible":
        return (
          <React.Fragment>
            <i className="bg-danger" />
            <span className="font-weight-bold">Expired</span>
          </React.Fragment>
        );

      default:
        return (
          <React.Fragment>
            <i className="bg-success" />
            Paid
          </React.Fragment>
        );
    }
  };

  // const renderTableRows = () => {
  //   const filteredInvoices = filterUniqueObjects(invoices);
  //   return filteredInvoices.map((invoice) => {
  //     return (
  //       <tr
  //         key={invoice.id}
  //         onClick={(e) => window.open(invoice.hosted_invoice_url, "_blank")}
  //         className="cursor-pointer"
  //       >
  //         <th scope="row" style={{ textTransform: "uppercase" }}>
  //           {invoice.number}
  //         </th>
  //         <td className="text-center">
  //           <span
  //             className="font-weight-bold"
  //             style={{ textTransform: "uppercase" }}
  //           >{`${invoice.currency} ${
  //             parseInt(invoice.total) > 0 ? parseInt(invoice.total) : 0
  //           }`}</span>
  //         </td>
  //         <td className="text-center">
  //           <Badge color="" className="badge-dot">
  //             {renderInvoiceStatus(invoice)}
  //           </Badge>
  //         </td>
  //         <td className="text-center">{invoice.created}</td>
  //         <td className="text-center">{`${invoice.productStart} ~ ${invoice.productEnd}`}</td>
  //       </tr>
  //     );
  //   });
  // };

  const renderTable = () => {
    const filteredInvoices = filterUniqueObjects(invoices);
    return (
      <>
        <ProTable
          rowKey="id"
          options={false}
          pagination={false}
          search={false}
          dateFormatter={false}
          headerTitle={false}
          dataSource={filteredInvoices}
          columns={[
            {
              title: "Invoice ID",
              dataIndex: "number",
              render: (number, invoice) => {
                return (
                  <Button
                    type="link"
                    onClick={(e) =>
                      window.open(invoice.hosted_invoice_url, "_blank")
                    }
                  >
                    {number}
                  </Button>
                );
              },
            },
            {
              title: "Amount",
              render: (_, invoice) => {
                return (
                  <span
                    className="font-weight-bold"
                    style={{ textTransform: "uppercase" }}
                  >{`${invoice.currency} ${
                    parseInt(invoice.total) > 0 ? parseInt(invoice.total) : 0
                  }`}</span>
                );
              },
            },
            {
              title: "Status",
              dataIndex: "status",
              render: (_, invoice) => {
                return renderInvoiceStatus(invoice);
              },
            },
            {
              title: "Invoice Date",
              dataIndex: "created",
            },
            {
              title: "Invoice Period",
              render: (_, invoice) => {
                return `${invoice.productStart} ~ ${invoice.productEnd}`;
              },
            },
          ]}
        />
        <br />
        {reachedEnd ? (
          <span>- End of all invoices -</span>
        ) : (
          <Button
            onClick={(e) => {
              fetchInvoices(qs.docs[qs.docs.length - 1]);
            }}
            type="link"
          >
            View Past Invoices
          </Button>
        )}
      </>
    );
  };

  useEffect(() => {
    stableFetchInvoices();
    return () => {
      mountedRef.current = false;
    };
  }, [stableFetchInvoices]);

  //Auto refresh Invoice Table if it is empty
  useEffect(() => {
    if (autoRefresh) {
      let intervalID = setInterval(() => {
        if (isEmpty(invoices)) {
          stableFetchInvoices();
        }
      }, 2000);
      return () => {
        clearInterval(intervalID);
      };
    }
  }, [invoices, stableFetchInvoices, autoRefresh]);

  return (
    <React.Fragment>
      <Row>
        <Col span={24} align="center">
          {isLoading
            ? renderLoader()
            : isEmpty(invoices)
            ? renderEmptyInvoice()
            : renderTable()}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default InvoiceTable;
