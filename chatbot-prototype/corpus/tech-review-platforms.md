---
title: platform and technology stack
dimension: tools/technology
synthetic: true
---

# Platform and technology stack

## Review and analytics platforms

The firm runs its review databases on "Iris", an in-house review platform that handles document review, issue coding, privilege logging and production output. Iris is supported by "Atlas Scoping" style analytics add-ons: communication visualisation, email threading and near-duplicate mapping. Iris instances are spun up per matter, so a matter's review database is a self-contained environment.

## Processing toolchain

Processing runs on the "Forge" pipeline: a set of batch services that handle file signature identification, unicode/EBCDIC handling, archive expansion, OCR scheduling and load-file generation. Forge is orchestrated by workflow jobs that record every step for audit. The pipeline is CPU-bound; large matters queue on the processing grid, which is the main capacity constraint in peak weeks.

## The intelligence layer

Above the operational tools sits the company's intelligence and reporting layer. It aggregates matter data, staffing, revenue and deadlines from the operational systems into a single analytical store. The intelligence layer is what powers the dashboards and the natural-language chat assistant that the firm is building. It is read-only: it never writes back into Iris, Forge or any client system.

## Tooling notes

The tooling landscape changes as new versions of the review platforms are evaluated. Any platform change must pass a security and chain-of-custody review before it can be used on active matters. TAR models are versioned per matter so a coding decision can always be reproduced.