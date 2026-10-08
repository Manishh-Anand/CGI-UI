---
title: eDiscovery workflow lifecycle
dimension: workflow
synthetic: true
---

# eDiscovery workflow lifecycle

## Overview

The core service the firm delivers is end-to-end eDiscovery for litigating and regulatory matters: taking raw, unorganised data from clients and custodians and turning it into a defensible, production-ready review database. The end-to-end lifecycle has five phases: collection, processing, review, production and billing. Each phase has its own tools, deliverables and quality gates.

## Collection

Collection is the first phase. Data is gathered from custodians, devices, cloud mailboxes and chat platforms. Collection methods include forensic imaging of laptops and phones and targeted exports from systems of record. The goal is to preserve data in place, keep a defensible chain of custody, and minimise spoliation risk. Collection produces a manifest of every item with source location, hash, and capture time.

## Processing

Processing is the second phase. Raw data is normalised and enriched before reviewers ever see it. The processing team runs near-duplicate detection, email threading, language detection and optical character recognition. Files that cannot be searched or reviewed (for example unrecoverable-corrupt items or system files) are reported in a hit/exception report. The main deliverable of processing is a review database or load file, plus a set of structured analytics such as communication graphs and date histograms.

## Review

Review is the third phase. Reviewers examine documents against the case issues and mark them for relevance, privilege, responsiveness or issue tags. Technology-assisted review (TAR) is used on large matters: a small seed set is coded by senior reviewers, a model learns the coding pattern, and the model ranks the remaining population so reviewers focus on the most relevant documents first. The review phase produces an import file of coded decisions that is auditable and can be rolled back.

## Production

Production is the fourth phase. Documents that are responsive and non-privileged are prepared for delivery to the opposing party or regulator. This means applying redactions, extracting text for load-file preparation, and producing in the format required by the case (for example near-native TIFFs with a VENDI or DAT load file). Every production has a privilege log listing withheld documents and the privilege asserted.

## Billing

Billing is the final phase. Work is billed per reviewed document, per gigabyte processed or on a fixed fee per matter. Monthly accruals are reconciled against the budget and any scope creep is flagged to account management. The billing phase produces the invoice, but it also feeds the firm's own revenue forecasting, which is why billing data is a key input to the intelligence dashboard.

## Quality gates

Each phase has defined exit criteria: collection completeness, processing hit-rate thresholds, review TAR precision/recall targets, production QC re-read counts and billing reconciliation signs-offs. A phase is not considered closed until its gate has been signed off by the phase lead.