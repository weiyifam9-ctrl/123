# Aurum Global Payments

A high-fidelity, responsive private-finance dashboard concept for US and Chinese clients. It includes multi-currency accounts, recent activity, common money movement actions, private-client concierge access, and a 12-module financial innovation lab.

## Run locally

```bash
npm start
```

Open <http://localhost:4173>. Run the API and static-server tests with `npm test`.

## Production scaling note

This repository is an interactive product prototype, not a licensed payment processor. A production launch for 100,000 concurrent sessions should place the stateless web/API tier behind regional load balancers and a CDN, use an audited double-entry ledger, idempotent payment orchestration, queue-backed workflows, sharded data stores, hardware-backed key management, and active-active US/Asia disaster recovery. PCI DSS, KYC/AML, sanctions screening, data-residency, money-transmitter, and local regulatory requirements must be completed before real funds or personal financial data are accepted.
