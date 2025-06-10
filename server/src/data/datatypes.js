module.exports = {
  "gsCustomers": [
    {
      "columnName": "gsCustomersID",
      "dataType": "INT"
    },
    {
      "columnName": "CompanyName",
      "dataType": "TEXT"
    },
    {
      "columnName": "FirstName",
      "dataType": "TEXT"
    },
    {
      "columnName": "MiddleName",
      "dataType": "TEXT"
    },
    {
      "columnName": "LastName",
      "dataType": "TEXT"
    },
    {
      "columnName": "Email",
      "dataType": "TEXT"
    },
    {
      "columnName": "Street",
      "dataType": "TEXT"
    },
    {
      "columnName": "Street2",
      "dataType": "TEXT"
    },
    {
      "columnName": "City",
      "dataType": "TEXT"
    },
    {
      "columnName": "State",
      "dataType": "TEXT"
    },
    {
      "columnName": "Zipcode",
      "dataType": "TEXT"
    },
    {
      "columnName": "County",
      "dataType": "TEXT"
    },
    {
      "columnName": "International",
      "dataType": "TEXT"
    }
  ],
  "tblPlan": [
    {
      "columnName": "PlanID",
      "dataType": "INT"
    },
    {
      "columnName": "Name",
      "dataType": "TEXT"
    }
  ],
  "tblPlanSubscription": [
    {
      "columnName": "SubscriptionId",
      "dataType": "INT"
    },
    {
      "columnName": "Number",
      "dataType": "TEXT"
    },
    {
      "columnName": "PlanID",
      "dataType": "INT"
    },
    {
      "columnName": "CustomerID",
      "dataType": "INT"
    },
    {
      "columnName": "Status",
      "dataType": "TEXT"
    },
    {
      "columnName": "StartDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "NextBillingAt",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "RenewalDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "EndDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "IsAutoCollection",
      "dataType": "BOOLEAN"
    },
    {
      "columnName": "CreatedOn",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "EndAction",
      "dataType": "INT"
    },
    {
      "columnName": "TotalTermAmount",
      "dataType": "NUMERIC(10,2)"
    }
  ],
  "tblPlanSubscriptionBillingTerm": [
    {
      "columnName": "ID",
      "dataType": "INT"
    },
    {
      "columnName": "SubscriptionId",
      "dataType": "INT"
    },
    {
      "columnName": "BillingStartDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "BillingEndDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "Status",
      "dataType": "TEXT"
    },
    {
      "columnName": "PaymentGatewayStatus",
      "dataType": "TEXT"
    },
    {
      "columnName": "Amount",
      "dataType": "NUMERIC(10,2)"
    }
  ],
  "tblPlanSubscriptionCancel": [
    {
      "columnName": "ID",
      "dataType": "INT"
    },
    {
      "columnName": "SubscriptionId",
      "dataType": "INT"
    },
    {
      "columnName": "CancelledBy",
      "dataType": "INT"
    },
    {
      "columnName": "ToBeCancelled",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "CancelledDate",
      "dataType": "TIMESTAMP"
    },
    {
      "columnName": "Source",
      "dataType": "TEXT"
    },
    {
      "columnName": "Status",
      "dataType": "TEXT"
    },
    {
      "columnName": "ReasonID",
      "dataType": "INT"
    }
  ],
  "tblPlanSubscriptionCancelReason": [
    {
      "columnName": "CancelReasonID",
      "dataType": "INT"
    },
    {
      "columnName": "Name",
      "dataType": "TEXT"
    }
  ],
  "tblPlanSubscriptionGift": [
    {
      "columnName": "SubscriptionID",
      "dataType": "INT"
    },
    {
      "columnName": "IsGifted",
      "dataType": "BOOLEAN"
    },
    {
      "columnName": "GiftedBy",
      "dataType": "INT"
    }
  ],
  "tblPlanSubscriptionBillingTermPayment": [
    {
      "columnName": "SubscriptionID",
      "dataType": "INT"
    },
    {
      "columnName": "BillingTermID",
      "dataType": "INT"
    },
    {
      "columnName": "PaymentID",
      "dataType": "INT"
    },
    {
      "columnName": "Amount",
      "dataType": "NUMERIC(10,2)"
    }
  ]
}