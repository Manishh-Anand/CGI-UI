
/*
    Consilio Enterprise Data Model - SQL Server
    Generated from the supplied Excel workbooks and WORKFLOW.md (2026-10-09).

    Scope:
      - Client/account, domains, services, client-service relationships, revenue, lifecycle
      - Company profile, locations, metrics, leadership, milestones, offerings, awards, financials
      - Product engineering / EDRM phases, applications, tools, vendors, technology stack and mappings
      - Pre-engagement, conflicts, staffing, opportunities, contracts and handover
      - Client service requests, routing, decisions, SLA, fulfillment and lifecycle history
      - Infosec teams, capabilities, tools, controls, findings, incidents and handoffs
      - Competitor master and normalized product/security/commercial/financial/EDRM/AI details
      - Data provenance, sources, validation issues and import batches

    Notes:
      - This is a normalized target schema, not a claim that every draft workflow is validated.
      - Values marked "proposed", "unknown", or "to validate" in source files remain modelable as data.
      - Run in a new database or review naming conflicts before executing.
      - No source spreadsheet rows are inserted by this script.
*/
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF SCHEMA_ID(N'ref') IS NULL EXEC(N'CREATE SCHEMA ref');
IF SCHEMA_ID(N'core') IS NULL EXEC(N'CREATE SCHEMA core');
IF SCHEMA_ID(N'crm') IS NULL EXEC(N'CREATE SCHEMA crm');
IF SCHEMA_ID(N'engagement') IS NULL EXEC(N'CREATE SCHEMA engagement');
IF SCHEMA_ID(N'service') IS NULL EXEC(N'CREATE SCHEMA service');
IF SCHEMA_ID(N'edrm') IS NULL EXEC(N'CREATE SCHEMA edrm');
IF SCHEMA_ID(N'tech') IS NULL EXEC(N'CREATE SCHEMA tech');
IF SCHEMA_ID(N'security') IS NULL EXEC(N'CREATE SCHEMA security');
IF SCHEMA_ID(N'market') IS NULL EXEC(N'CREATE SCHEMA market');
IF SCHEMA_ID(N'governance') IS NULL EXEC(N'CREATE SCHEMA governance');
IF SCHEMA_ID(N'staging') IS NULL EXEC(N'CREATE SCHEMA staging');
GO

/* Reference / controlled vocabularies */
CREATE TABLE ref.Currency (
    CurrencyCode char(3) NOT NULL CONSTRAINT PK_Currency PRIMARY KEY,
    CurrencyName nvarchar(80) NOT NULL
);
CREATE TABLE ref.Country (
    CountryCode nvarchar(3) NOT NULL CONSTRAINT PK_Country PRIMARY KEY,
    CountryName nvarchar(100) NOT NULL,
    RegionName nvarchar(100) NULL
);
CREATE TABLE ref.StatusType (
    StatusTypeId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_StatusType PRIMARY KEY,
    EntityName sysname NOT NULL,
    StatusCode nvarchar(50) NOT NULL,
    StatusName nvarchar(100) NOT NULL,
    IsTerminal bit NOT NULL CONSTRAINT DF_StatusType_IsTerminal DEFAULT (0),
    CONSTRAINT UQ_StatusType_Entity_Code UNIQUE (EntityName, StatusCode)
);
CREATE TABLE ref.WorkflowPhase (
    WorkflowPhaseId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkflowPhase PRIMARY KEY,
    PhaseCode nvarchar(50) NOT NULL UNIQUE,
    PhaseName nvarchar(150) NOT NULL,
    SequenceNo int NOT NULL,
    Description nvarchar(1000) NULL
);
CREATE TABLE ref.WorkflowState (
    WorkflowStateId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkflowState PRIMARY KEY,
    WorkflowName nvarchar(100) NOT NULL,
    StateCode nvarchar(50) NOT NULL,
    StateName nvarchar(100) NOT NULL,
    IsTerminal bit NOT NULL CONSTRAINT DF_WorkflowState_IsTerminal DEFAULT (0),
    CONSTRAINT UQ_WorkflowState_Name_Code UNIQUE (WorkflowName, StateCode)
);
CREATE TABLE ref.Department (
    DepartmentId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Department PRIMARY KEY,
    DepartmentName nvarchar(150) NOT NULL UNIQUE,
    ParentDepartmentId int NULL,
    Description nvarchar(1000) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_Department_IsActive DEFAULT (1),
    CONSTRAINT FK_Department_Parent FOREIGN KEY (ParentDepartmentId) REFERENCES ref.Department(DepartmentId)
);
CREATE TABLE ref.Team (
    TeamId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Team PRIMARY KEY,
    DepartmentId int NULL,
    TeamName nvarchar(150) NOT NULL,
    TeamType nvarchar(80) NULL,
    Description nvarchar(1000) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_Team_IsActive DEFAULT (1),
    CONSTRAINT FK_Team_Department FOREIGN KEY (DepartmentId) REFERENCES ref.Department(DepartmentId),
    CONSTRAINT UQ_Team_Department_Name UNIQUE (DepartmentId, TeamName)
);
CREATE TABLE ref.Person (
    PersonId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Person PRIMARY KEY,
    ExternalPersonKey nvarchar(150) NULL,
    FullName nvarchar(200) NOT NULL,
    EmailAddress nvarchar(320) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_Person_IsActive DEFAULT (1),
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_Person_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_Person_ExternalKey UNIQUE (ExternalPersonKey)
);
CREATE TABLE ref.SourceSystem (
    SourceSystemId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_SourceSystem PRIMARY KEY,
    SystemName nvarchar(150) NOT NULL UNIQUE,
    SystemType nvarchar(80) NULL,
    OwnerTeamId int NULL,
    IsInternal bit NULL,
    Description nvarchar(1000) NULL,
    CONSTRAINT FK_SourceSystem_Team FOREIGN KEY (OwnerTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE governance.SourceArtifact (
    SourceArtifactId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SourceArtifact PRIMARY KEY,
    SourceSystemId int NULL,
    FileName nvarchar(260) NOT NULL,
    WorksheetName nvarchar(128) NULL,
    SourceUri nvarchar(2048) NULL,
    SourceVersion nvarchar(100) NULL,
    CapturedAt datetime2(0) NULL,
    Notes nvarchar(max) NULL,
    CONSTRAINT FK_SourceArtifact_SourceSystem FOREIGN KEY (SourceSystemId) REFERENCES ref.SourceSystem(SourceSystemId)
);
CREATE TABLE governance.ImportBatch (
    ImportBatchId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ImportBatch PRIMARY KEY,
    SourceArtifactId bigint NOT NULL,
    StartedAt datetime2(0) NOT NULL CONSTRAINT DF_ImportBatch_StartedAt DEFAULT (SYSUTCDATETIME()),
    CompletedAt datetime2(0) NULL,
    BatchStatus nvarchar(30) NOT NULL CONSTRAINT DF_ImportBatch_Status DEFAULT ('Created'),
    RowsRead int NULL,
    RowsInserted int NULL,
    RowsRejected int NULL,
    ErrorSummary nvarchar(max) NULL,
    CONSTRAINT FK_ImportBatch_SourceArtifact FOREIGN KEY (SourceArtifactId) REFERENCES governance.SourceArtifact(SourceArtifactId)
);
CREATE TABLE governance.DataQualityIssue (
    DataQualityIssueId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_DataQualityIssue PRIMARY KEY,
    SourceArtifactId bigint NULL,
    EntityName nvarchar(150) NOT NULL,
    SourceRecordKey nvarchar(200) NULL,
    IssueCode nvarchar(50) NOT NULL,
    IssueDescription nvarchar(2000) NOT NULL,
    SuggestedOwnerTeamId int NULL,
    PriorityCode nvarchar(20) NULL,
    IssueStatus nvarchar(30) NOT NULL CONSTRAINT DF_DataQualityIssue_Status DEFAULT ('Open'),
    ResolutionNotes nvarchar(max) NULL,
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_DataQualityIssue_CreatedAt DEFAULT (SYSUTCDATETIME()),
    ResolvedAt datetime2(0) NULL,
    CONSTRAINT FK_DQI_Source FOREIGN KEY (SourceArtifactId) REFERENCES governance.SourceArtifact(SourceArtifactId),
    CONSTRAINT FK_DQI_Team FOREIGN KEY (SuggestedOwnerTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE governance.EntitySource (
    EntitySourceId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_EntitySource PRIMARY KEY,
    EntityType nvarchar(100) NOT NULL,
    EntityKey nvarchar(200) NOT NULL,
    SourceArtifactId bigint NOT NULL,
    SourceRecordKey nvarchar(200) NULL,
    SourceUrl nvarchar(2048) NULL,
    ConfidenceCode nvarchar(30) NULL,
    IsPrimarySource bit NOT NULL CONSTRAINT DF_EntitySource_Primary DEFAULT (0),
    Notes nvarchar(1000) NULL,
    CONSTRAINT FK_EntitySource_Artifact FOREIGN KEY (SourceArtifactId) REFERENCES governance.SourceArtifact(SourceArtifactId)
);
CREATE INDEX IX_EntitySource_Entity ON governance.EntitySource(EntityType, EntityKey);

/* Company profile and corporate intelligence */
CREATE TABLE core.Company (
    CompanyId uniqueidentifier NOT NULL CONSTRAINT PK_Company PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    LegalName nvarchar(200) NOT NULL,
    BrandName nvarchar(150) NULL,
    FormerName nvarchar(200) NULL,
    ShortDescription nvarchar(1000) NULL,
    OverviewText nvarchar(max) NULL,
    FoundedYear smallint NULL,
    BrandNameChangeYear smallint NULL,
    WebsiteUrl nvarchar(2048) NULL,
    CompanyType nvarchar(100) NULL,
    IndustryDescription nvarchar(500) NULL,
    HeadquartersLocationId bigint NULL,
    RegisteredAddress nvarchar(500) NULL,
    OwnershipSummary nvarchar(1000) NULL,
    FiscalYearEnd tinyint NULL,
    LogoUrl nvarchar(2048) NULL,
    ProfileStatus nvarchar(30) NOT NULL CONSTRAINT DF_Company_ProfileStatus DEFAULT ('Draft'),
    LastReviewedDate date NULL,
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_Company_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT UQ_Company_LegalName UNIQUE (LegalName)
);
CREATE TABLE core.Location (
    LocationId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Location PRIMARY KEY,
    ExternalLocationKey nvarchar(100) NULL,
    LocationName nvarchar(200) NOT NULL,
    LocationType nvarchar(80) NULL,
    AddressLine nvarchar(300) NULL,
    City nvarchar(100) NULL,
    StateProvince nvarchar(100) NULL,
    PostalCode nvarchar(30) NULL,
    CountryCode nvarchar(3) NULL,
    RegionName nvarchar(100) NULL,
    Latitude decimal(9,6) NULL,
    Longitude decimal(9,6) NULL,
    IsHeadquarters bit NULL,
    OpenedDate date NULL,
    ClosedDate date NULL,
    Headcount int NULL,
    HeadcountAsOfDate date NULL,
    PublicListingStatus nvarchar(50) NULL,
    CONSTRAINT FK_Location_Country FOREIGN KEY (CountryCode) REFERENCES ref.Country(CountryCode),
    CONSTRAINT UQ_Location_ExternalKey UNIQUE (ExternalLocationKey)
);
ALTER TABLE core.Company ADD CONSTRAINT FK_Company_Headquarters FOREIGN KEY (HeadquartersLocationId) REFERENCES core.Location(LocationId);
CREATE TABLE core.CompanyMetric (
    CompanyMetricId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompanyMetric PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    MetricName nvarchar(150) NOT NULL,
    MetricValue decimal(20,4) NULL,
    ValueQualifier nvarchar(50) NULL,
    ValueLowerBound decimal(20,4) NULL,
    ValueUpperBound decimal(20,4) NULL,
    UnitName nvarchar(80) NULL,
    PeriodType nvarchar(50) NULL,
    PeriodStartDate date NULL,
    PeriodEndDate date NULL,
    AsOfDate date NULL,
    GeographicScope nvarchar(150) NULL,
    BusinessScope nvarchar(150) NULL,
    IsEstimate bit NOT NULL CONSTRAINT DF_CompanyMetric_IsEstimate DEFAULT (0),
    MethodologyNote nvarchar(2000) NULL,
    CONSTRAINT FK_CompanyMetric_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId)
);
CREATE TABLE core.Leader (
    LeaderId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Leader PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    PersonId bigint NULL,
    FullName nvarchar(200) NOT NULL,
    JobTitle nvarchar(200) NULL,
    LeadershipLevel nvarchar(80) NULL,
    LeadershipFunction nvarchar(150) NULL,
    DepartmentId int NULL,
    RegionScope nvarchar(150) NULL,
    BioSummary nvarchar(2000) NULL,
    ProfileUrl nvarchar(2048) NULL,
    PhotoUrl nvarchar(2048) NULL,
    AppointmentDate date NULL,
    AnnouncementDate date NULL,
    EndDate date NULL,
    IsCurrent bit NOT NULL CONSTRAINT DF_Leader_IsCurrent DEFAULT (1),
    DisplayOrder int NULL,
    CONSTRAINT FK_Leader_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_Leader_Person FOREIGN KEY (PersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT FK_Leader_Department FOREIGN KEY (DepartmentId) REFERENCES ref.Department(DepartmentId)
);
CREATE TABLE core.CompanyMilestone (
    CompanyMilestoneId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompanyMilestone PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    EventTitle nvarchar(250) NOT NULL,
    EventType nvarchar(80) NULL,
    TransactionType nvarchar(80) NULL,
    CounterpartyCompanyId uniqueidentifier NULL,
    CounterpartyName nvarchar(200) NULL,
    AnnouncementDate date NULL,
    AgreementDate date NULL,
    ClosingDate date NULL,
    EffectiveDate date NULL,
    EventStatus nvarchar(50) NULL,
    AcquiredScope nvarchar(1000) NULL,
    BusinessDescription nvarchar(max) NULL,
    StrategicRationale nvarchar(2000) NULL,
    GeographicScope nvarchar(200) NULL,
    DealValue decimal(20,2) NULL,
    DealCurrencyCode char(3) NULL,
    CountAsAcquisition bit NULL,
    CountingGroupId uniqueidentifier NULL,
    CONSTRAINT FK_Milestone_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_Milestone_Counterparty FOREIGN KEY (CounterpartyCompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_Milestone_Currency FOREIGN KEY (DealCurrencyCode) REFERENCES ref.Currency(CurrencyCode)
);
CREATE TABLE core.ServiceSolution (
    ServiceSolutionId uniqueidentifier NOT NULL CONSTRAINT PK_ServiceSolution PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    CompanyId uniqueidentifier NOT NULL,
    Name nvarchar(200) NOT NULL,
    OfferingType nvarchar(80) NULL,
    Category nvarchar(120) NULL,
    Description nvarchar(max) NULL,
    UseCases nvarchar(max) NULL,
    TargetClientTypes nvarchar(500) NULL,
    GeographicAvailability nvarchar(300) NULL,
    DeliveryModel nvarchar(120) NULL,
    RelatedServiceSolutionId uniqueidentifier NULL,
    IsActive bit NOT NULL CONSTRAINT DF_ServiceSolution_IsActive DEFAULT (1),
    OfficialUrl nvarchar(2048) NULL,
    CONSTRAINT FK_ServiceSolution_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_ServiceSolution_Related FOREIGN KEY (RelatedServiceSolutionId) REFERENCES core.ServiceSolution(ServiceSolutionId),
    CONSTRAINT UQ_ServiceSolution_Company_Name UNIQUE (CompanyId, Name)
);
CREATE TABLE core.Industry (
    IndustryId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Industry PRIMARY KEY,
    IndustryName nvarchar(200) NOT NULL UNIQUE,
    Description nvarchar(1000) NULL
);
CREATE TABLE core.ServiceSolutionIndustry (
    ServiceSolutionId uniqueidentifier NOT NULL,
    IndustryId int NOT NULL,
    CONSTRAINT PK_ServiceSolutionIndustry PRIMARY KEY (ServiceSolutionId, IndustryId),
    CONSTRAINT FK_SSI_Service FOREIGN KEY (ServiceSolutionId) REFERENCES core.ServiceSolution(ServiceSolutionId),
    CONSTRAINT FK_SSI_Industry FOREIGN KEY (IndustryId) REFERENCES core.Industry(IndustryId)
);
CREATE TABLE core.MarketSegment (
    MarketSegmentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_MarketSegment PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    SegmentType nvarchar(80) NOT NULL,
    SegmentName nvarchar(200) NOT NULL,
    Description nvarchar(1000) NULL,
    ServiceSolutionId uniqueidentifier NULL,
    CONSTRAINT FK_MarketSegment_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_MarketSegment_Service FOREIGN KEY (ServiceSolutionId) REFERENCES core.ServiceSolution(ServiceSolutionId),
    CONSTRAINT UQ_MarketSegment UNIQUE (CompanyId, SegmentType, SegmentName, ServiceSolutionId)
);
CREATE TABLE core.WorkforceMetric (
    WorkforceMetricId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkforceMetric PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    PopulationType nvarchar(100) NOT NULL,
    CountValue int NULL,
    CountQualifier nvarchar(50) NULL,
    EmploymentRelationship nvarchar(100) NULL,
    BusinessFunction nvarchar(150) NULL,
    LocationId bigint NULL,
    RegionName nvarchar(100) NULL,
    CountryCode nvarchar(3) NULL,
    PeriodStartDate date NULL,
    PeriodEndDate date NULL,
    AsOfDate date NULL,
    MethodologyNote nvarchar(2000) NULL,
    CONSTRAINT FK_Workforce_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_Workforce_Location FOREIGN KEY (LocationId) REFERENCES core.Location(LocationId),
    CONSTRAINT FK_Workforce_Country FOREIGN KEY (CountryCode) REFERENCES ref.Country(CountryCode)
);
CREATE TABLE core.LanguageCapability (
    LanguageCapabilityId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_LanguageCapability PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    LanguageName nvarchar(100) NOT NULL,
    LanguageCode nvarchar(10) NULL,
    ServiceSolutionId uniqueidentifier NULL,
    CapabilityType nvarchar(100) NULL,
    GeographicScope nvarchar(150) NULL,
    ProfessionalCount int NULL,
    IsActive bit NOT NULL CONSTRAINT DF_LanguageCapability_IsActive DEFAULT (1),
    CONSTRAINT FK_Language_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_Language_Service FOREIGN KEY (ServiceSolutionId) REFERENCES core.ServiceSolution(ServiceSolutionId)
);
CREATE TABLE core.Award (
    AwardId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Award PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    AwardName nvarchar(250) NOT NULL,
    AwardingBody nvarchar(150) NULL,
    AwardYear smallint NULL,
    AwardCategory nvarchar(150) NULL,
    Description nvarchar(2000) NULL,
    AwardStatus nvarchar(50) NULL,
    CONSTRAINT FK_Award_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId)
);
CREATE TABLE core.CompanyFinancial (
    CompanyFinancialId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompanyFinancial PRIMARY KEY,
    CompanyId uniqueidentifier NOT NULL,
    FinancialMetric nvarchar(100) NOT NULL,
    FiscalYear smallint NULL,
    Amount decimal(22,2) NULL,
    CurrencyCode char(3) NULL,
    ValueBasis nvarchar(100) NULL,
    ScopeNote nvarchar(2000) NULL,
    Classification nvarchar(50) NULL,
    CONSTRAINT FK_CompanyFinancial_Company FOREIGN KEY (CompanyId) REFERENCES core.Company(CompanyId),
    CONSTRAINT FK_CompanyFinancial_Currency FOREIGN KEY (CurrencyCode) REFERENCES ref.Currency(CurrencyCode)
);

/* Client / account data */
CREATE TABLE crm.Domain (
    DomainId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_Domain PRIMARY KEY,
    DomainCode nvarchar(30) NULL UNIQUE,
    DomainName nvarchar(150) NOT NULL UNIQUE,
    Description nvarchar(1000) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_Domain_IsActive DEFAULT (1)
);
CREATE TABLE crm.Client (
    ClientId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Client PRIMARY KEY,
    SourceClientKey nvarchar(100) NULL,
    ClientName nvarchar(250) NOT NULL,
    DomainId int NULL,
    CountryRegion nvarchar(150) NULL,
    CompanySize nvarchar(80) NULL,
    CompanyRevenue decimal(22,2) NULL,
    CompanyRevenueCurrency char(3) NULL,
    EmployeeCount int NULL,
    TenureStartDate date NULL,
    ClientStatus nvarchar(50) NOT NULL CONSTRAINT DF_Client_Status DEFAULT ('Unknown'),
    ClientValueScore decimal(9,2) NULL,
    ClientValueTier nvarchar(30) NULL,
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_Client_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt datetime2(0) NOT NULL CONSTRAINT DF_Client_UpdatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_Client_Domain FOREIGN KEY (DomainId) REFERENCES crm.Domain(DomainId),
    CONSTRAINT FK_Client_Currency FOREIGN KEY (CompanyRevenueCurrency) REFERENCES ref.Currency(CurrencyCode),
    CONSTRAINT UQ_Client_SourceKey UNIQUE (SourceClientKey)
);
CREATE INDEX IX_Client_Name ON crm.Client(ClientName);
CREATE TABLE crm.Service (
    ServiceId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Service PRIMARY KEY,
    SourceServiceKey nvarchar(100) NULL,
    ServiceName nvarchar(200) NOT NULL UNIQUE,
    ServiceCategory nvarchar(120) NULL,
    Description nvarchar(max) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_Service_IsActive DEFAULT (1),
    CONSTRAINT UQ_Service_SourceKey UNIQUE (SourceServiceKey)
);
CREATE TABLE crm.ClientService (
    ClientServiceId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientService PRIMARY KEY,
    ClientId bigint NOT NULL,
    ServiceId bigint NOT NULL,
    ServiceStartDate date NULL,
    ServiceEndDate date NULL,
    ServiceStatus nvarchar(50) NOT NULL CONSTRAINT DF_ClientService_Status DEFAULT ('Active'),
    ContractReference nvarchar(150) NULL,
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_ClientService_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_ClientService_Client FOREIGN KEY (ClientId) REFERENCES crm.Client(ClientId),
    CONSTRAINT FK_ClientService_Service FOREIGN KEY (ServiceId) REFERENCES crm.Service(ServiceId),
    CONSTRAINT CK_ClientService_Dates CHECK (ServiceEndDate IS NULL OR ServiceStartDate IS NULL OR ServiceEndDate >= ServiceStartDate),
    CONSTRAINT UQ_ClientService UNIQUE (ClientId, ServiceId, ServiceStartDate)
);
CREATE TABLE crm.ClientRevenue (
    ClientRevenueId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientRevenue PRIMARY KEY,
    ClientId bigint NOT NULL,
    ServiceId bigint NOT NULL,
    PeriodType nvarchar(30) NOT NULL,
    PeriodStart date NOT NULL,
    PeriodEnd date NOT NULL,
    RevenueGenerated decimal(22,2) NOT NULL,
    CurrencyCode char(3) NOT NULL,
    RevenuePctOfTotal decimal(12,8) NULL,
    YearOverYearGrowthPct decimal(12,8) NULL,
    SourceNote nvarchar(1000) NULL,
    CONSTRAINT FK_ClientRevenue_Client FOREIGN KEY (ClientId) REFERENCES crm.Client(ClientId),
    CONSTRAINT FK_ClientRevenue_Service FOREIGN KEY (ServiceId) REFERENCES crm.Service(ServiceId),
    CONSTRAINT FK_ClientRevenue_Currency FOREIGN KEY (CurrencyCode) REFERENCES ref.Currency(CurrencyCode),
    CONSTRAINT CK_ClientRevenue_Dates CHECK (PeriodEnd >= PeriodStart),
    CONSTRAINT CK_ClientRevenue_Amount CHECK (RevenueGenerated >= 0)
);
CREATE TABLE crm.ClientLifecycle (
    ClientLifecycleId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientLifecycle PRIMARY KEY,
    ClientId bigint NOT NULL,
    ClientStatus nvarchar(50) NOT NULL,
    EffectiveFrom datetime2(0) NOT NULL,
    EffectiveTo datetime2(0) NULL,
    ChurnReason nvarchar(1000) NULL,
    IsCurrent bit NOT NULL CONSTRAINT DF_ClientLifecycle_IsCurrent DEFAULT (0),
    ChangedByPersonId bigint NULL,
    CONSTRAINT FK_ClientLifecycle_Client FOREIGN KEY (ClientId) REFERENCES crm.Client(ClientId),
    CONSTRAINT FK_ClientLifecycle_Person FOREIGN KEY (ChangedByPersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT CK_ClientLifecycle_Dates CHECK (EffectiveTo IS NULL OR EffectiveTo >= EffectiveFrom)
);
CREATE UNIQUE INDEX UX_ClientLifecycle_Current ON crm.ClientLifecycle(ClientId) WHERE IsCurrent = 1;

/* Engagement / pre-engagement and conflict clearance */
CREATE TABLE engagement.MatterType (
    MatterTypeId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_MatterType PRIMARY KEY,
    MatterTypeCode nvarchar(40) NOT NULL UNIQUE,
    MatterTypeName nvarchar(100) NOT NULL
);
CREATE TABLE engagement.Engagement (
    EngagementId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Engagement PRIMARY KEY,
    EngagementKey nvarchar(100) NULL UNIQUE,
    ClientId bigint NOT NULL,
    MatterTypeId int NULL,
    RelationshipOwnerPersonId bigint NULL,
    EngagementTitle nvarchar(250) NOT NULL,
    ScopeOverview nvarchar(max) NULL,
    UrgencyCode nvarchar(30) NULL,
    BudgetIndicator nvarchar(100) NULL,
    IntakeSource nvarchar(100) NULL,
    CRMSourceSystemId int NULL,
    EngagementStatus nvarchar(50) NOT NULL CONSTRAINT DF_Engagement_Status DEFAULT ('New'),
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_Engagement_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt datetime2(0) NOT NULL CONSTRAINT DF_Engagement_UpdatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_Engagement_Client FOREIGN KEY (ClientId) REFERENCES crm.Client(ClientId),
    CONSTRAINT FK_Engagement_MatterType FOREIGN KEY (MatterTypeId) REFERENCES engagement.MatterType(MatterTypeId),
    CONSTRAINT FK_Engagement_Owner FOREIGN KEY (RelationshipOwnerPersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT FK_Engagement_CRM FOREIGN KEY (CRMSourceSystemId) REFERENCES ref.SourceSystem(SourceSystemId)
);
CREATE TABLE engagement.ConflictCheck (
    ConflictCheckId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ConflictCheck PRIMARY KEY,
    EngagementId bigint NOT NULL,
    RequestedAt datetime2(0) NOT NULL CONSTRAINT DF_ConflictCheck_RequestedAt DEFAULT (SYSUTCDATETIME()),
    CompletedAt datetime2(0) NULL,
    ConflictStatus nvarchar(30) NOT NULL CONSTRAINT DF_ConflictCheck_Status DEFAULT ('Pending'),
    MatterDescription nvarchar(max) NULL,
    Jurisdiction nvarchar(150) NULL,
    CheckerTool nvarchar(150) NULL,
    ReviewedByPersonId bigint NULL,
    ClearanceCertificateUri nvarchar(2048) NULL,
    EscalationRequired bit NOT NULL CONSTRAINT DF_ConflictCheck_Escalation DEFAULT (0),
    CONSTRAINT FK_ConflictCheck_Engagement FOREIGN KEY (EngagementId) REFERENCES engagement.Engagement(EngagementId),
    CONSTRAINT FK_ConflictCheck_Reviewer FOREIGN KEY (ReviewedByPersonId) REFERENCES ref.Person(PersonId)
);
CREATE TABLE engagement.ConflictParty (
    ConflictPartyId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ConflictParty PRIMARY KEY,
    ConflictCheckId bigint NOT NULL,
    PartyName nvarchar(250) NOT NULL,
    PartyType nvarchar(80) NULL,
    IsAdverseParty bit NOT NULL CONSTRAINT DF_ConflictParty_Adverse DEFAULT (0),
    Notes nvarchar(1000) NULL,
    CONSTRAINT FK_ConflictParty_Check FOREIGN KEY (ConflictCheckId) REFERENCES engagement.ConflictCheck(ConflictCheckId)
);
CREATE TABLE engagement.StaffingPlan (
    StaffingPlanId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_StaffingPlan PRIMARY KEY,
    EngagementId bigint NOT NULL,
    PlanStatus nvarchar(40) NOT NULL CONSTRAINT DF_StaffingPlan_Status DEFAULT ('Draft'),
    EstimatedTotalHours decimal(12,2) NULL,
    RateCardVersion nvarchar(100) NULL,
    PreliminaryBudget decimal(22,2) NULL,
    BudgetCurrencyCode char(3) NULL,
    CreatedAt datetime2(0) NOT NULL CONSTRAINT DF_StaffingPlan_CreatedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_StaffingPlan_Engagement FOREIGN KEY (EngagementId) REFERENCES engagement.Engagement(EngagementId),
    CONSTRAINT FK_StaffingPlan_Currency FOREIGN KEY (BudgetCurrencyCode) REFERENCES ref.Currency(CurrencyCode)
);
CREATE TABLE engagement.StaffingAssignment (
    StaffingAssignmentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_StaffingAssignment PRIMARY KEY,
    StaffingPlanId bigint NOT NULL,
    PersonId bigint NULL,
    TeamId int NULL,
    AssignedRole nvarchar(120) NOT NULL,
    EstimatedHours decimal(12,2) NULL,
    HourlyRate decimal(18,4) NULL,
    CurrencyCode char(3) NULL,
    AssignmentStatus nvarchar(40) NOT NULL CONSTRAINT DF_StaffingAssignment_Status DEFAULT ('Proposed'),
    CONSTRAINT FK_StaffingAssignment_Plan FOREIGN KEY (StaffingPlanId) REFERENCES engagement.StaffingPlan(StaffingPlanId),
    CONSTRAINT FK_StaffingAssignment_Person FOREIGN KEY (PersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT FK_StaffingAssignment_Team FOREIGN KEY (TeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_StaffingAssignment_Currency FOREIGN KEY (CurrencyCode) REFERENCES ref.Currency(CurrencyCode)
);
CREATE TABLE engagement.Opportunity (
    OpportunityId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Opportunity PRIMARY KEY,
    ExternalOpportunityKey nvarchar(150) NULL,
    EngagementId bigint NOT NULL,
    OpportunityName nvarchar(250) NOT NULL,
    ScopeSummary nvarchar(max) NULL,
    PricingModel nvarchar(40) NULL,
    ProposalStage nvarchar(60) NOT NULL CONSTRAINT DF_Opportunity_Stage DEFAULT ('Draft'),
    ProposedValue decimal(22,2) NULL,
    CurrencyCode char(3) NULL,
    ExpectedCloseDate date NULL,
    ClosedWonDate datetime2(0) NULL,
    DataReadyDate date NULL,
    StartDate date NULL,
    CreatedByPersonId bigint NULL,
    CONSTRAINT FK_Opportunity_Engagement FOREIGN KEY (EngagementId) REFERENCES engagement.Engagement(EngagementId),
    CONSTRAINT FK_Opportunity_Currency FOREIGN KEY (CurrencyCode) REFERENCES ref.Currency(CurrencyCode),
    CONSTRAINT FK_Opportunity_Creator FOREIGN KEY (CreatedByPersonId) REFERENCES ref.Person(PersonId)
);
CREATE TABLE engagement.OpportunityDeliverable (
    OpportunityDeliverableId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_OpportunityDeliverable PRIMARY KEY,
    OpportunityId bigint NOT NULL,
    DeliverableName nvarchar(250) NOT NULL,
    Description nvarchar(1000) NULL,
    DueDate date NULL,
    AcceptanceCriteria nvarchar(2000) NULL,
    CONSTRAINT FK_OpportunityDeliverable_Opportunity FOREIGN KEY (OpportunityId) REFERENCES engagement.Opportunity(OpportunityId)
);
CREATE TABLE engagement.Contract (
    ContractId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Contract PRIMARY KEY,
    OpportunityId bigint NOT NULL,
    ContractReference nvarchar(150) NULL,
    ContractType nvarchar(80) NULL,
    ContractStatus nvarchar(40) NOT NULL CONSTRAINT DF_Contract_Status DEFAULT ('Draft'),
    SignedDate date NULL,
    EffectiveDate date NULL,
    ExpiryDate date NULL,
    ContractValue decimal(22,2) NULL,
    CurrencyCode char(3) NULL,
    ContractDocumentUri nvarchar(2048) NULL,
    ContractSystem nvarchar(100) NULL,
    CONSTRAINT FK_Contract_Opportunity FOREIGN KEY (OpportunityId) REFERENCES engagement.Opportunity(OpportunityId),
    CONSTRAINT FK_Contract_Currency FOREIGN KEY (CurrencyCode) REFERENCES ref.Currency(CurrencyCode),
    CONSTRAINT CK_Contract_Dates CHECK (ExpiryDate IS NULL OR EffectiveDate IS NULL OR ExpiryDate >= EffectiveDate)
);
CREATE TABLE engagement.Handover (
    HandoverId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Handover PRIMARY KEY,
    OpportunityId bigint NOT NULL,
    HandoverType nvarchar(80) NOT NULL,
    TriggerType nvarchar(80) NULL,
    TriggeredAt datetime2(0) NULL,
    HandoverStatus nvarchar(40) NOT NULL CONSTRAINT DF_Handover_Status DEFAULT ('Pending'),
    TargetSystemId int NULL,
    PayloadReference nvarchar(2048) NULL,
    ChecklistJson nvarchar(max) NULL,
    CompletedAt datetime2(0) NULL,
    ErrorDetails nvarchar(max) NULL,
    CONSTRAINT FK_Handover_Opportunity FOREIGN KEY (OpportunityId) REFERENCES engagement.Opportunity(OpportunityId),
    CONSTRAINT FK_Handover_TargetSystem FOREIGN KEY (TargetSystemId) REFERENCES ref.SourceSystem(SourceSystemId),
    CONSTRAINT CK_Handover_Json CHECK (ChecklistJson IS NULL OR ISJSON(ChecklistJson) = 1)
);

/* Client service requests and fulfillment */
CREATE TABLE service.ClientTier (
    ClientTierId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_ClientTier PRIMARY KEY,
    TierCode nvarchar(30) NOT NULL UNIQUE,
    TierName nvarchar(80) NOT NULL,
    Description nvarchar(1000) NULL
);
CREATE TABLE service.ServiceRequestType (
    ServiceRequestTypeId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceRequestType PRIMARY KEY,
    RequestTypeCode nvarchar(50) NOT NULL UNIQUE,
    RequestTypeName nvarchar(150) NOT NULL,
    Description nvarchar(1000) NULL
);
CREATE TABLE service.ServiceRequest (
    ServiceRequestId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceRequest PRIMARY KEY,
    ExternalRequestKey nvarchar(150) NULL,
    ClientId bigint NOT NULL,
    ClientTierId int NULL,
    ServiceRequestTypeId int NULL,
    SubmittedAt datetime2(0) NOT NULL CONSTRAINT DF_ServiceRequest_SubmittedAt DEFAULT (SYSUTCDATETIME()),
    RequestedForDate date NULL,
    RequestTitle nvarchar(250) NOT NULL,
    RequestDescription nvarchar(max) NULL,
    RequestFormat nvarchar(40) NULL,
    RequestPath nvarchar(20) NULL,
    PriorityCode nvarchar(20) NULL,
    ImpactDescription nvarchar(1000) NULL,
    CurrentStateId int NULL,
    AssignedTeamId int NULL,
    AssignedPersonId bigint NULL,
    SourceSystemId int NULL,
    ClosedAt datetime2(0) NULL,
    CONSTRAINT FK_ServiceRequest_Client FOREIGN KEY (ClientId) REFERENCES crm.Client(ClientId),
    CONSTRAINT FK_ServiceRequest_Tier FOREIGN KEY (ClientTierId) REFERENCES service.ClientTier(ClientTierId),
    CONSTRAINT FK_ServiceRequest_Type FOREIGN KEY (ServiceRequestTypeId) REFERENCES service.ServiceRequestType(ServiceRequestTypeId),
    CONSTRAINT FK_ServiceRequest_State FOREIGN KEY (CurrentStateId) REFERENCES ref.WorkflowState(WorkflowStateId),
    CONSTRAINT FK_ServiceRequest_Team FOREIGN KEY (AssignedTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_ServiceRequest_Person FOREIGN KEY (AssignedPersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT FK_ServiceRequest_Source FOREIGN KEY (SourceSystemId) REFERENCES ref.SourceSystem(SourceSystemId),
    CONSTRAINT UQ_ServiceRequest_ExternalKey UNIQUE (ExternalRequestKey)
);
CREATE INDEX IX_ServiceRequest_Client_State ON service.ServiceRequest(ClientId, CurrentStateId, SubmittedAt);
CREATE TABLE service.RequestRouting (
    RequestRoutingId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestRouting PRIMARY KEY,
    ServiceRequestId bigint NOT NULL,
    FromPath nvarchar(40) NULL,
    ToPath nvarchar(40) NOT NULL,
    SubPath nvarchar(80) NULL,
    RoutedAt datetime2(0) NOT NULL CONSTRAINT DF_RequestRouting_RoutedAt DEFAULT (SYSUTCDATETIME()),
    RoutedByPersonId bigint NULL,
    RoutingReason nvarchar(1000) NULL,
    CONSTRAINT FK_RequestRouting_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_RequestRouting_Person FOREIGN KEY (RoutedByPersonId) REFERENCES ref.Person(PersonId)
);
CREATE TABLE service.RequestDecision (
    RequestDecisionId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestDecision PRIMARY KEY,
    ServiceRequestId bigint NOT NULL,
    DecisionType nvarchar(50) NOT NULL,
    DecisionCode nvarchar(30) NOT NULL,
    DecisionReason nvarchar(2000) NULL,
    DecidedAt datetime2(0) NOT NULL CONSTRAINT DF_RequestDecision_DecidedAt DEFAULT (SYSUTCDATETIME()),
    DecidedByPersonId bigint NULL,
    AppealStatus nvarchar(40) NULL,
    CONSTRAINT FK_RequestDecision_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_RequestDecision_Person FOREIGN KEY (DecidedByPersonId) REFERENCES ref.Person(PersonId)
);
CREATE TABLE service.ServiceCatalogItem (
    ServiceCatalogItemId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceCatalogItem PRIMARY KEY,
    CatalogCode nvarchar(80) NOT NULL UNIQUE,
    CatalogName nvarchar(200) NOT NULL,
    Description nvarchar(2000) NULL,
    IsCustomService bit NOT NULL CONSTRAINT DF_ServiceCatalog_Custom DEFAULT (0),
    OwningTeamId int NULL,
    IsActive bit NOT NULL CONSTRAINT DF_ServiceCatalog_Active DEFAULT (1),
    CONSTRAINT FK_ServiceCatalog_Team FOREIGN KEY (OwningTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE service.RequestCatalogItem (
    ServiceRequestId bigint NOT NULL,
    ServiceCatalogItemId bigint NOT NULL,
    Quantity decimal(12,2) NOT NULL CONSTRAINT DF_RequestCatalog_Quantity DEFAULT (1),
    ItemNotes nvarchar(1000) NULL,
    CONSTRAINT PK_RequestCatalogItem PRIMARY KEY (ServiceRequestId, ServiceCatalogItemId),
    CONSTRAINT FK_RequestCatalog_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_RequestCatalog_Item FOREIGN KEY (ServiceCatalogItemId) REFERENCES service.ServiceCatalogItem(ServiceCatalogItemId)
);
CREATE TABLE service.ServiceLevelAgreement (
    ServiceLevelAgreementId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ServiceLevelAgreement PRIMARY KEY,
    SLAName nvarchar(200) NOT NULL,
    ClientTierId int NULL,
    RequestPath nvarchar(30) NULL,
    RequestTypeId bigint NULL,
    ResponseTargetMinutes int NULL,
    ResolutionTargetMinutes int NULL,
    EffectiveFrom date NULL,
    EffectiveTo date NULL,
    IsProposed bit NOT NULL CONSTRAINT DF_SLA_Proposed DEFAULT (1),
    Notes nvarchar(1000) NULL,
    CONSTRAINT FK_SLA_Tier FOREIGN KEY (ClientTierId) REFERENCES service.ClientTier(ClientTierId),
    CONSTRAINT FK_SLA_RequestType FOREIGN KEY (RequestTypeId) REFERENCES service.ServiceCatalogItem(ServiceCatalogItemId),
    CONSTRAINT CK_SLA_Targets CHECK ((ResponseTargetMinutes IS NULL OR ResponseTargetMinutes >= 0) AND (ResolutionTargetMinutes IS NULL OR ResolutionTargetMinutes >= 0))
);
CREATE TABLE service.RequestSLA (
    RequestSLAId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestSLA PRIMARY KEY,
    ServiceRequestId bigint NOT NULL,
    ServiceLevelAgreementId bigint NOT NULL,
    ResponseDueAt datetime2(0) NULL,
    ResolutionDueAt datetime2(0) NULL,
    FirstResponseAt datetime2(0) NULL,
    ResolvedAt datetime2(0) NULL,
    ResponseSlaMet bit NULL,
    ResolutionSlaMet bit NULL,
    CONSTRAINT FK_RequestSLA_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_RequestSLA_SLA FOREIGN KEY (ServiceLevelAgreementId) REFERENCES service.ServiceLevelAgreement(ServiceLevelAgreementId),
    CONSTRAINT UQ_RequestSLA UNIQUE (ServiceRequestId, ServiceLevelAgreementId)
);
CREATE TABLE service.Fulfillment (
    FulfillmentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Fulfillment PRIMARY KEY,
    ServiceRequestId bigint NOT NULL,
    FulfillmentType nvarchar(100) NULL,
    FulfillmentStatus nvarchar(40) NOT NULL CONSTRAINT DF_Fulfillment_Status DEFAULT ('Pending'),
    AssignedTeamId int NULL,
    StartedAt datetime2(0) NULL,
    DeliveredAt datetime2(0) NULL,
    ClientNotifiedAt datetime2(0) NULL,
    ClosureNotes nvarchar(max) NULL,
    CONSTRAINT FK_Fulfillment_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_Fulfillment_Team FOREIGN KEY (AssignedTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE service.RequestStateHistory (
    RequestStateHistoryId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_RequestStateHistory PRIMARY KEY,
    ServiceRequestId bigint NOT NULL,
    PreviousStateId int NULL,
    NewStateId int NOT NULL,
    ChangedAt datetime2(0) NOT NULL CONSTRAINT DF_RequestStateHistory_ChangedAt DEFAULT (SYSUTCDATETIME()),
    ChangedByPersonId bigint NULL,
    ChangeReason nvarchar(1000) NULL,
    CONSTRAINT FK_RequestHistory_Request FOREIGN KEY (ServiceRequestId) REFERENCES service.ServiceRequest(ServiceRequestId),
    CONSTRAINT FK_RequestHistory_Previous FOREIGN KEY (PreviousStateId) REFERENCES ref.WorkflowState(WorkflowStateId),
    CONSTRAINT FK_RequestHistory_New FOREIGN KEY (NewStateId) REFERENCES ref.WorkflowState(WorkflowStateId),
    CONSTRAINT FK_RequestHistory_Person FOREIGN KEY (ChangedByPersonId) REFERENCES ref.Person(PersonId)
);

/* EDRM / delivery workflow */
CREATE TABLE edrm.DeliveryPhase (
    DeliveryPhaseId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_DeliveryPhase PRIMARY KEY,
    PhaseCode nvarchar(40) NOT NULL UNIQUE,
    PhaseName nvarchar(150) NOT NULL,
    SequenceNo int NOT NULL UNIQUE,
    Purpose nvarchar(2000) NULL,
    EDRMGroup nvarchar(100) NULL
);
CREATE TABLE edrm.EDRMStage (
    EDRMStageId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_EDRMStage PRIMARY KEY,
    StageCode nvarchar(40) NOT NULL UNIQUE,
    StageName nvarchar(150) NOT NULL,
    SequenceNo int NOT NULL UNIQUE,
    Description nvarchar(1000) NULL
);
CREATE TABLE edrm.Workflow (
    WorkflowId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_EDRMWorkflow PRIMARY KEY,
    WorkflowName nvarchar(200) NOT NULL,
    WorkflowOwnerTeamId int NULL,
    WorkflowType nvarchar(80) NOT NULL,
    Description nvarchar(max) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_EDRMWorkflow_Active DEFAULT (1),
    CONSTRAINT FK_EDRMWorkflow_Team FOREIGN KEY (WorkflowOwnerTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE edrm.WorkflowStep (
    WorkflowStepId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkflowStep PRIMARY KEY,
    WorkflowId bigint NOT NULL,
    DeliveryPhaseId int NULL,
    EDRMStageId int NULL,
    StepCode nvarchar(50) NULL,
    StepName nvarchar(200) NOT NULL,
    SequenceNo int NOT NULL,
    Description nvarchar(max) NULL,
    EntryCriteria nvarchar(1000) NULL,
    ExitCriteria nvarchar(1000) NULL,
    IsManual bit NULL,
    CONSTRAINT FK_WorkflowStep_Workflow FOREIGN KEY (WorkflowId) REFERENCES edrm.Workflow(WorkflowId),
    CONSTRAINT FK_WorkflowStep_Phase FOREIGN KEY (DeliveryPhaseId) REFERENCES edrm.DeliveryPhase(DeliveryPhaseId),
    CONSTRAINT FK_WorkflowStep_EDRMStage FOREIGN KEY (EDRMStageId) REFERENCES edrm.EDRMStage(EDRMStageId),
    CONSTRAINT UQ_WorkflowStep_Sequence UNIQUE (WorkflowId, SequenceNo)
);
CREATE TABLE edrm.WorkflowTransition (
    WorkflowTransitionId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkflowTransition PRIMARY KEY,
    WorkflowId bigint NOT NULL,
    FromWorkflowStepId bigint NOT NULL,
    ToWorkflowStepId bigint NOT NULL,
    TransitionCondition nvarchar(1000) NULL,
    IsDefault bit NOT NULL CONSTRAINT DF_WorkflowTransition_Default DEFAULT (0),
    CONSTRAINT FK_WorkflowTransition_Workflow FOREIGN KEY (WorkflowId) REFERENCES edrm.Workflow(WorkflowId),
    CONSTRAINT FK_WorkflowTransition_From FOREIGN KEY (FromWorkflowStepId) REFERENCES edrm.WorkflowStep(WorkflowStepId),
    CONSTRAINT FK_WorkflowTransition_To FOREIGN KEY (ToWorkflowStepId) REFERENCES edrm.WorkflowStep(WorkflowStepId),
    CONSTRAINT CK_WorkflowTransition_DifferentSteps CHECK (FromWorkflowStepId <> ToWorkflowStepId)
);
CREATE TABLE edrm.WorkflowHandoff (
    WorkflowHandoffId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_WorkflowHandoff PRIMARY KEY,
    WorkflowId bigint NOT NULL,
    FromWorkflowStepId bigint NULL,
    ToWorkflowStepId bigint NULL,
    FromTeamId int NULL,
    ToTeamId int NULL,
    ArtifactName nvarchar(200) NULL,
    ArtifactFormat nvarchar(100) NULL,
    TargetSlaMinutes int NULL,
    Notes nvarchar(1000) NULL,
    CONSTRAINT FK_WorkflowHandoff_Workflow FOREIGN KEY (WorkflowId) REFERENCES edrm.Workflow(WorkflowId),
    CONSTRAINT FK_WorkflowHandoff_FromStep FOREIGN KEY (FromWorkflowStepId) REFERENCES edrm.WorkflowStep(WorkflowStepId),
    CONSTRAINT FK_WorkflowHandoff_ToStep FOREIGN KEY (ToWorkflowStepId) REFERENCES edrm.WorkflowStep(WorkflowStepId),
    CONSTRAINT FK_WorkflowHandoff_FromTeam FOREIGN KEY (FromTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_WorkflowHandoff_ToTeam FOREIGN KEY (ToTeamId) REFERENCES ref.Team(TeamId)
);

/* Technology catalogue and stack mappings */
CREATE TABLE tech.Vendor (
    VendorId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Vendor PRIMARY KEY,
    VendorName nvarchar(200) NOT NULL UNIQUE,
    VendorType nvarchar(80) NULL,
    WebsiteUrl nvarchar(2048) NULL,
    IsInternal bit NULL,
    Notes nvarchar(1000) NULL
);
CREATE TABLE tech.Application (
    ApplicationId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Application PRIMARY KEY,
    CanonicalName nvarchar(200) NOT NULL UNIQUE,
    RecordType nvarchar(80) NULL,
    Description nvarchar(max) NULL,
    CategoryRole nvarchar(150) NULL,
    DeploymentSourcing nvarchar(150) NULL,
    ClientUser bit NULL,
    InternalUser bit NULL,
    IsInHouseProduct bit NULL,
    StatusCode nvarchar(80) NULL,
    ClassificationType nvarchar(100) NULL,
    BusinessProcess nvarchar(200) NULL,
    ArchitectureSummary nvarchar(max) NULL,
    ValidationNotes nvarchar(max) NULL,
    PrimaryTeamId int NULL,
    PrimaryVendorId bigint NULL,
    SourceSystemId int NULL,
    CONSTRAINT FK_Application_Team FOREIGN KEY (PrimaryTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_Application_Vendor FOREIGN KEY (PrimaryVendorId) REFERENCES tech.Vendor(VendorId),
    CONSTRAINT FK_Application_SourceSystem FOREIGN KEY (SourceSystemId) REFERENCES ref.SourceSystem(SourceSystemId)
);
CREATE TABLE tech.ApplicationAlias (
    ApplicationAliasId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ApplicationAlias PRIMARY KEY,
    ApplicationId bigint NOT NULL,
    AliasName nvarchar(200) NOT NULL,
    AliasSource nvarchar(200) NULL,
    IsPreferred bit NOT NULL CONSTRAINT DF_ApplicationAlias_Preferred DEFAULT (0),
    CONSTRAINT FK_ApplicationAlias_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT UQ_ApplicationAlias UNIQUE (ApplicationId, AliasName)
);
CREATE TABLE tech.ApplicationVendor (
    ApplicationId bigint NOT NULL,
    VendorId bigint NOT NULL,
    RelationshipType nvarchar(80) NOT NULL CONSTRAINT DF_ApplicationVendor_RelationshipType DEFAULT ('Related'),
    IsPrimary bit NOT NULL CONSTRAINT DF_ApplicationVendor_Primary DEFAULT (0),
    EffectiveFrom date NULL,
    EffectiveTo date NULL,
    CONSTRAINT PK_ApplicationVendor PRIMARY KEY (ApplicationId, VendorId, RelationshipType),
    CONSTRAINT FK_ApplicationVendor_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationVendor_Vendor FOREIGN KEY (VendorId) REFERENCES tech.Vendor(VendorId)
);
CREATE TABLE tech.TechnologyCategory (
    TechnologyCategoryId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_TechnologyCategory PRIMARY KEY,
    CategoryName nvarchar(150) NOT NULL UNIQUE,
    CategoryDescription nvarchar(1000) NULL
);
CREATE TABLE tech.TechnologyItem (
    TechnologyItemId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_TechnologyItem PRIMARY KEY,
    TechnologyCategoryId int NOT NULL,
    TechnologyName nvarchar(200) NOT NULL,
    TechnologyType nvarchar(100) NULL,
    VendorId bigint NULL,
    VersionText nvarchar(100) NULL,
    Description nvarchar(1000) NULL,
    CONSTRAINT FK_TechnologyItem_Category FOREIGN KEY (TechnologyCategoryId) REFERENCES tech.TechnologyCategory(TechnologyCategoryId),
    CONSTRAINT FK_TechnologyItem_Vendor FOREIGN KEY (VendorId) REFERENCES tech.Vendor(VendorId),
    CONSTRAINT UQ_TechnologyItem UNIQUE (TechnologyCategoryId, TechnologyName, VersionText)
);
CREATE TABLE tech.ApplicationTechnology (
    ApplicationId bigint NOT NULL,
    TechnologyItemId bigint NOT NULL,
    UsageRole nvarchar(100) NOT NULL CONSTRAINT DF_ApplicationTechnology_UsageRole DEFAULT ('Unspecified'),
    IsPrimary bit NOT NULL CONSTRAINT DF_ApplicationTechnology_Primary DEFAULT (0),
    Notes nvarchar(1000) NULL,
    CONSTRAINT PK_ApplicationTechnology PRIMARY KEY (ApplicationId, TechnologyItemId, UsageRole),
    CONSTRAINT FK_ApplicationTechnology_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationTechnology_Item FOREIGN KEY (TechnologyItemId) REFERENCES tech.TechnologyItem(TechnologyItemId)
);
CREATE TABLE tech.ApplicationPhase (
    ApplicationId bigint NOT NULL,
    DeliveryPhaseId int NOT NULL,
    RoleDescription nvarchar(1000) NULL,
    IsPrimary bit NOT NULL CONSTRAINT DF_ApplicationPhase_Primary DEFAULT (0),
    CONSTRAINT PK_ApplicationPhase PRIMARY KEY (ApplicationId, DeliveryPhaseId),
    CONSTRAINT FK_ApplicationPhase_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationPhase_Phase FOREIGN KEY (DeliveryPhaseId) REFERENCES edrm.DeliveryPhase(DeliveryPhaseId)
);
CREATE TABLE tech.ApplicationEDRMStage (
    ApplicationId bigint NOT NULL,
    EDRMStageId int NOT NULL,
    RoleDescription nvarchar(1000) NULL,
    CONSTRAINT PK_ApplicationEDRMStage PRIMARY KEY (ApplicationId, EDRMStageId),
    CONSTRAINT FK_ApplicationEDRMStage_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationEDRMStage_Stage FOREIGN KEY (EDRMStageId) REFERENCES edrm.EDRMStage(EDRMStageId)
);
CREATE TABLE tech.ApplicationIntegration (
    ApplicationIntegrationId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ApplicationIntegration PRIMARY KEY,
    SourceApplicationId bigint NOT NULL,
    TargetApplicationId bigint NOT NULL,
    IntegrationType nvarchar(80) NULL,
    DirectionCode nvarchar(30) NULL,
    InterfaceName nvarchar(150) NULL,
    DataDescription nvarchar(1000) NULL,
    IsActive bit NOT NULL CONSTRAINT DF_ApplicationIntegration_Active DEFAULT (1),
    Notes nvarchar(1000) NULL,
    CONSTRAINT FK_ApplicationIntegration_Source FOREIGN KEY (SourceApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationIntegration_Target FOREIGN KEY (TargetApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT CK_ApplicationIntegration_DifferentApps CHECK (SourceApplicationId <> TargetApplicationId)
);
CREATE TABLE tech.ApplicationCapability (
    ApplicationCapabilityId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ApplicationCapability PRIMARY KEY,
    ApplicationId bigint NOT NULL,
    CapabilityName nvarchar(200) NOT NULL,
    CapabilityCategory nvarchar(100) NULL,
    Description nvarchar(2000) NULL,
    PrimaryTeamId int NULL,
    StatusCode nvarchar(50) NULL,
    CONSTRAINT FK_ApplicationCapability_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationCapability_Team FOREIGN KEY (PrimaryTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT UQ_ApplicationCapability UNIQUE (ApplicationId, CapabilityName)
);

/* Security / Infosec */
CREATE TABLE security.SecurityPhase (
    SecurityPhaseId int IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityPhase PRIMARY KEY,
    PhaseCode nvarchar(40) NOT NULL UNIQUE,
    PhaseName nvarchar(120) NOT NULL,
    SequenceNo int NOT NULL UNIQUE,
    Objective nvarchar(1000) NULL
);
CREATE TABLE security.SecurityCapability (
    SecurityCapabilityId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityCapability PRIMARY KEY,
    CapabilityName nvarchar(200) NOT NULL UNIQUE,
    CapabilityCategory nvarchar(120) NULL,
    Description nvarchar(2000) NULL,
    SecurityPhaseId int NULL,
    PrimaryTeamId int NULL,
    CONSTRAINT FK_SecurityCapability_Phase FOREIGN KEY (SecurityPhaseId) REFERENCES security.SecurityPhase(SecurityPhaseId),
    CONSTRAINT FK_SecurityCapability_Team FOREIGN KEY (PrimaryTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE security.TeamCapability (
    TeamId int NOT NULL,
    SecurityCapabilityId bigint NOT NULL,
    ResponsibilityCode nvarchar(10) NULL,
    IsPrimary bit NOT NULL CONSTRAINT DF_TeamCapability_Primary DEFAULT (0),
    CONSTRAINT PK_TeamCapability PRIMARY KEY (TeamId, SecurityCapabilityId),
    CONSTRAINT FK_TeamCapability_Team FOREIGN KEY (TeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_TeamCapability_Capability FOREIGN KEY (SecurityCapabilityId) REFERENCES security.SecurityCapability(SecurityCapabilityId)
);
CREATE TABLE security.SecurityControl (
    SecurityControlId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityControl PRIMARY KEY,
    ControlCode nvarchar(80) NULL UNIQUE,
    ControlName nvarchar(200) NOT NULL,
    ControlType nvarchar(100) NULL,
    FrameworkName nvarchar(100) NULL,
    Description nvarchar(2000) NULL,
    OwnerTeamId int NULL,
    IsActive bit NOT NULL CONSTRAINT DF_SecurityControl_Active DEFAULT (1),
    CONSTRAINT FK_SecurityControl_Team FOREIGN KEY (OwnerTeamId) REFERENCES ref.Team(TeamId)
);
CREATE TABLE security.ApplicationControl (
    ApplicationId bigint NOT NULL,
    SecurityControlId bigint NOT NULL,
    ImplementationStatus nvarchar(50) NULL,
    LastValidatedAt datetime2(0) NULL,
    EvidenceReference nvarchar(2048) NULL,
    CONSTRAINT PK_ApplicationControl PRIMARY KEY (ApplicationId, SecurityControlId),
    CONSTRAINT FK_ApplicationControl_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_ApplicationControl_Control FOREIGN KEY (SecurityControlId) REFERENCES security.SecurityControl(SecurityControlId)
);
CREATE TABLE security.SecurityIncident (
    SecurityIncidentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityIncident PRIMARY KEY,
    ExternalIncidentKey nvarchar(150) NULL,
    IncidentTitle nvarchar(250) NOT NULL,
    IncidentType nvarchar(100) NULL,
    SeverityCode nvarchar(30) NULL,
    IncidentStatus nvarchar(50) NOT NULL CONSTRAINT DF_SecurityIncident_Status DEFAULT ('Open'),
    DetectedAt datetime2(0) NULL,
    ReportedAt datetime2(0) NULL,
    ResolvedAt datetime2(0) NULL,
    Description nvarchar(max) NULL,
    RootCause nvarchar(max) NULL,
    ReportedByPersonId bigint NULL,
    OwnerTeamId int NULL,
    SourceApplicationId bigint NULL,
    CONSTRAINT FK_SecurityIncident_Reporter FOREIGN KEY (ReportedByPersonId) REFERENCES ref.Person(PersonId),
    CONSTRAINT FK_SecurityIncident_Team FOREIGN KEY (OwnerTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_SecurityIncident_Application FOREIGN KEY (SourceApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT UQ_SecurityIncident_ExternalKey UNIQUE (ExternalIncidentKey)
);
CREATE TABLE security.SecurityFinding (
    SecurityFindingId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityFinding PRIMARY KEY,
    FindingKey nvarchar(150) NULL,
    FindingTitle nvarchar(250) NOT NULL,
    FindingType nvarchar(100) NULL,
    SeverityCode nvarchar(30) NULL,
    FindingStatus nvarchar(50) NOT NULL CONSTRAINT DF_SecurityFinding_Status DEFAULT ('Open'),
    DiscoveredAt datetime2(0) NULL,
    DueDate date NULL,
    RemediatedAt datetime2(0) NULL,
    Description nvarchar(max) NULL,
    RemediationPlan nvarchar(max) NULL,
    OwnerTeamId int NULL,
    ApplicationId bigint NULL,
    SecurityControlId bigint NULL,
    SourceSecurityIncidentId bigint NULL,
    CONSTRAINT FK_SecurityFinding_Team FOREIGN KEY (OwnerTeamId) REFERENCES ref.Team(TeamId),
    CONSTRAINT FK_SecurityFinding_Application FOREIGN KEY (ApplicationId) REFERENCES tech.Application(ApplicationId),
    CONSTRAINT FK_SecurityFinding_Control FOREIGN KEY (SecurityControlId) REFERENCES security.SecurityControl(SecurityControlId),
    CONSTRAINT FK_SecurityFinding_Incident FOREIGN KEY (SourceSecurityIncidentId) REFERENCES security.SecurityIncident(SecurityIncidentId),
    CONSTRAINT UQ_SecurityFinding_Key UNIQUE (FindingKey)
);
CREATE TABLE security.SecurityAssessment (
    SecurityAssessmentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_SecurityAssessment PRIMARY KEY,
    AssessmentName nvarchar(250) NOT NULL,
    AssessmentType nvarchar(100) NULL,
    AssessorType nvarchar(80) NULL,
    StartDate date NULL,
    EndDate date NULL,
    AssessmentStatus nvarchar(50) NULL,
    Summary nvarchar(max) NULL,
    ExternalVendorId bigint NULL,
    CONSTRAINT FK_SecurityAssessment_Vendor FOREIGN KEY (ExternalVendorId) REFERENCES tech.Vendor(VendorId)
);
CREATE TABLE security.AssessmentFinding (
    SecurityAssessmentId bigint NOT NULL,
    SecurityFindingId bigint NOT NULL,
    CONSTRAINT PK_AssessmentFinding PRIMARY KEY (SecurityAssessmentId, SecurityFindingId),
    CONSTRAINT FK_AssessmentFinding_Assessment FOREIGN KEY (SecurityAssessmentId) REFERENCES security.SecurityAssessment(SecurityAssessmentId),
    CONSTRAINT FK_AssessmentFinding_Finding FOREIGN KEY (SecurityFindingId) REFERENCES security.SecurityFinding(SecurityFindingId)
);
CREATE TABLE security.ThirdPartyRiskAssessment (
    ThirdPartyRiskAssessmentId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_ThirdPartyRiskAssessment PRIMARY KEY,
    VendorId bigint NOT NULL,
    AssessmentDate date NULL,
    RiskRating nvarchar(30) NULL,
    AssessmentStatus nvarchar(50) NULL,
    SecurityScore decimal(9,2) NULL,
    FindingsSummary nvarchar(max) NULL,
    NextReviewDate date NULL,
    CONSTRAINT FK_TPRA_Vendor FOREIGN KEY (VendorId) REFERENCES tech.Vendor(VendorId)
);

/* Competitor / market intelligence */
CREATE TABLE market.Competitor (
    CompetitorId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_Competitor PRIMARY KEY,
    CompetitorName nvarchar(200) NOT NULL UNIQUE,
    RankOverall int NULL,
    CompanyType nvarchar(150) NULL,
    HeadquartersCountry nvarchar(100) NULL,
    FoundedYear smallint NULL,
    OwnershipModel nvarchar(150) NULL,
    StockTickerExchange nvarchar(100) NULL,
    EmployeeCount int NULL,
    CompetitiveTier nvarchar(150) NULL,
    CompetitorArchetype nvarchar(150) NULL,
    ThreatLevel nvarchar(30) NULL,
    PrimaryCustomerSegments nvarchar(max) NULL,
    SourceConfidence nvarchar(50) NULL,
    Notes nvarchar(max) NULL
);
CREATE TABLE market.CompetitorCustomerSegment (
    CompetitorId bigint NOT NULL,
    SegmentName nvarchar(200) NOT NULL,
    CONSTRAINT PK_CompetitorCustomerSegment PRIMARY KEY (CompetitorId, SegmentName),
    CONSTRAINT FK_CompetitorSegment_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorProductArchitecture (
    CompetitorId bigint NOT NULL CONSTRAINT PK_CompetitorProductArchitecture PRIMARY KEY,
    CoreProductPlatform nvarchar(max) NULL,
    ProprietaryProductDescription nvarchar(1000) NULL,
    DeploymentModel nvarchar(150) NULL,
    PrimaryCloudHostingProvider nvarchar(150) NULL,
    PublicApiAvailability nvarchar(50) NULL,
    IntegrationCapabilityTier nvarchar(100) NULL,
    DataCenterCountText nvarchar(100) NULL,
    CONSTRAINT FK_CompetitorArchitecture_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorDataResidency (
    CompetitorId bigint NOT NULL,
    RegionName nvarchar(150) NOT NULL,
    CONSTRAINT PK_CompetitorDataResidency PRIMARY KEY (CompetitorId, RegionName),
    CONSTRAINT FK_CompetitorResidency_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorEDRMCapability (
    CompetitorId bigint NOT NULL,
    CapabilityCode nvarchar(100) NOT NULL,
    CapabilityValue nvarchar(300) NULL,
    CapabilityNotes nvarchar(1000) NULL,
    CONSTRAINT PK_CompetitorEDRMCapability PRIMARY KEY (CompetitorId, CapabilityCode),
    CONSTRAINT FK_CompetitorEDRM_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorAIProfile (
    CompetitorId bigint NOT NULL CONSTRAINT PK_CompetitorAIProfile PRIMARY KEY,
    AICapabilities nvarchar(max) NULL,
    GenerativeAIStatus nvarchar(150) NULL,
    AIModelApproach nvarchar(max) NULL,
    AICustomerDataHandling nvarchar(max) NULL,
    AIDefensibilityFeatures nvarchar(max) NULL,
    AIPricingApproach nvarchar(max) NULL,
    CONSTRAINT FK_CompetitorAI_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorSecurityProfile (
    CompetitorId bigint NOT NULL CONSTRAINT PK_CompetitorSecurityProfile PRIMARY KEY,
    FedRAMPStatus nvarchar(150) NULL,
    CustomerManagedEncryptionKeys nvarchar(200) NULL,
    CONSTRAINT FK_CompetitorSecurity_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorCertification (
    CompetitorId bigint NOT NULL,
    CertificationName nvarchar(200) NOT NULL,
    CertificationStatus nvarchar(100) NULL,
    CONSTRAINT PK_CompetitorCertification PRIMARY KEY (CompetitorId, CertificationName),
    CONSTRAINT FK_CompetitorCertification_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorCommercialProfile (
    CompetitorId bigint NOT NULL CONSTRAINT PK_CompetitorCommercialProfile PRIMARY KEY,
    PricingModel nvarchar(max) NULL,
    PricingTransparency nvarchar(100) NULL,
    TrialDemoAvailability nvarchar(150) NULL,
    RatingText nvarchar(100) NULL,
    MainContribution nvarchar(max) NULL,
    Strengths nvarchar(max) NULL,
    Considerations nvarchar(max) NULL,
    LawFirmPenetrationClaim nvarchar(max) NULL,
    AnalystRecognition nvarchar(max) NULL,
    RecentStrategicEvents nvarchar(max) NULL,
    CONSTRAINT FK_CompetitorCommercial_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorFinancialMetric (
    CompetitorFinancialMetricId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompetitorFinancialMetric PRIMARY KEY,
    CompetitorId bigint NOT NULL,
    MetricName nvarchar(100) NOT NULL,
    MetricValue decimal(22,4) NULL,
    UnitName nvarchar(50) NULL,
    FiscalPeriod nvarchar(50) NULL,
    DisclosureType nvarchar(100) NULL,
    ScopeNote nvarchar(2000) NULL,
    IsEstimate bit NOT NULL CONSTRAINT DF_CompetitorFinancial_IsEstimate DEFAULT (0),
    CONSTRAINT FK_CompetitorFinancial_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorServiceFootprint (
    CompetitorId bigint NOT NULL CONSTRAINT PK_CompetitorServiceFootprint PRIMARY KEY,
    GlobalDeliveryScale nvarchar(max) NULL,
    InternationalFootprint nvarchar(max) NULL,
    CountryCountText nvarchar(100) NULL,
    ManagedReviewServices nvarchar(150) NULL,
    SupportModel nvarchar(150) NULL,
    TrainingCertificationProgram nvarchar(200) NULL,
    CONSTRAINT FK_CompetitorFootprint_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId)
);
CREATE TABLE market.CompetitorMarketContribution (
    CompetitorMarketContributionId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompetitorMarketContribution PRIMARY KEY,
    CompetitorId bigint NOT NULL,
    ContributionType nvarchar(80) NOT NULL,
    ContributionPct decimal(9,4) NULL,
    PeriodLabel nvarchar(50) NULL,
    MethodologyNote nvarchar(2000) NULL,
    IsEstimate bit NOT NULL CONSTRAINT DF_CompetitorContribution_Estimate DEFAULT (0),
    CONSTRAINT FK_CompetitorContribution_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId),
    CONSTRAINT UQ_CompetitorContribution UNIQUE (CompetitorId, ContributionType, PeriodLabel)
);
CREATE TABLE market.CompetitorService (
    CompetitorServiceId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompetitorService PRIMARY KEY,
    CompetitorId bigint NOT NULL,
    ServiceName nvarchar(200) NOT NULL,
    Description nvarchar(2000) NULL,
    CONSTRAINT FK_CompetitorService_Competitor FOREIGN KEY (CompetitorId) REFERENCES market.Competitor(CompetitorId),
    CONSTRAINT UQ_CompetitorService UNIQUE (CompetitorId, ServiceName)
);

/* Flexible data dictionary to preserve source-specific fields without flattening core entities */
CREATE TABLE governance.DataDictionaryField (
    DataDictionaryFieldId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_DataDictionaryField PRIMARY KEY,
    EntityName nvarchar(150) NOT NULL,
    FieldCode nvarchar(100) NOT NULL,
    FieldName nvarchar(200) NOT NULL,
    DataTypeDescription nvarchar(100) NULL,
    FieldDescription nvarchar(2000) NULL,
    SourceMethod nvarchar(200) NULL,
    SampleValue nvarchar(1000) NULL,
    IsRequired bit NULL,
    IsSensitive bit NOT NULL CONSTRAINT DF_DataDictionaryField_Sensitive DEFAULT (0),
    CONSTRAINT UQ_DataDictionaryField UNIQUE (EntityName, FieldCode)
);
CREATE TABLE governance.EntityAttributeValue (
    EntityAttributeValueId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_EntityAttributeValue PRIMARY KEY,
    EntityType nvarchar(150) NOT NULL,
    EntityKey nvarchar(200) NOT NULL,
    DataDictionaryFieldId bigint NOT NULL,
    ValueText nvarchar(max) NULL,
    ValueNumber decimal(22,6) NULL,
    ValueDate datetime2(0) NULL,
    ValueBoolean bit NULL,
    UnitName nvarchar(80) NULL,
    PeriodLabel nvarchar(100) NULL,
    GeographicScope nvarchar(150) NULL,
    SourceArtifactId bigint NULL,
    SourceUrl nvarchar(2048) NULL,
    CONSTRAINT FK_EntityAttributeValue_Field FOREIGN KEY (DataDictionaryFieldId) REFERENCES governance.DataDictionaryField(DataDictionaryFieldId),
    CONSTRAINT FK_EntityAttributeValue_Source FOREIGN KEY (SourceArtifactId) REFERENCES governance.SourceArtifact(SourceArtifactId),
    CONSTRAINT UQ_EntityAttributeValue UNIQUE (EntityType, EntityKey, DataDictionaryFieldId, PeriodLabel, GeographicScope)
);
CREATE TABLE staging.RawImportRow (
    RawImportRowId bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_RawImportRow PRIMARY KEY,
    ImportBatchId bigint NOT NULL,
    WorksheetName nvarchar(128) NOT NULL,
    SourceRowNumber int NOT NULL,
    SourceRecordKey nvarchar(200) NULL,
    RawPayload nvarchar(max) NOT NULL,
    ParseStatus nvarchar(30) NOT NULL CONSTRAINT DF_RawImportRow_ParseStatus DEFAULT ('Pending'),
    ValidationMessage nvarchar(max) NULL,
    ImportedAt datetime2(0) NOT NULL CONSTRAINT DF_RawImportRow_ImportedAt DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT FK_RawImportRow_Batch FOREIGN KEY (ImportBatchId) REFERENCES governance.ImportBatch(ImportBatchId),
    CONSTRAINT CK_RawImportRow_Json CHECK (ISJSON(RawPayload) = 1),
    CONSTRAINT UQ_RawImportRow_SourceRow UNIQUE (ImportBatchId, WorksheetName, SourceRowNumber)
);
GO

/* Useful indexes for common joins and workflow lookups */
CREATE INDEX IX_CompanyMetric_Company_Metric ON core.CompanyMetric(CompanyId, MetricName, AsOfDate);
CREATE INDEX IX_CompanyMilestone_Company_Date ON core.CompanyMilestone(CompanyId, EffectiveDate);
CREATE INDEX IX_ClientRevenue_Client_Period ON crm.ClientRevenue(ClientId, PeriodStart, PeriodEnd);
CREATE INDEX IX_Engagement_Client_Status ON engagement.Engagement(ClientId, EngagementStatus, CreatedAt);
CREATE INDEX IX_ConflictCheck_Engagement_Status ON engagement.ConflictCheck(EngagementId, ConflictStatus, RequestedAt);
CREATE INDEX IX_Opportunity_Stage ON engagement.Opportunity(ProposalStage, ExpectedCloseDate);
CREATE INDEX IX_WorkflowStep_Workflow ON edrm.WorkflowStep(WorkflowId, SequenceNo);
CREATE INDEX IX_Application_Category_Status ON tech.Application(CategoryRole, StatusCode);
CREATE INDEX IX_SecurityFinding_Status_Severity ON security.SecurityFinding(FindingStatus, SeverityCode, DueDate);
CREATE INDEX IX_Competitor_Rank ON market.Competitor(RankOverall, ThreatLevel);
GO

/* Seed baseline phases/states and commonly used currencies/countries.
   Extend these reference rows as approved values are confirmed. */
INSERT INTO ref.Currency (CurrencyCode, CurrencyName)
SELECT v.CurrencyCode, v.CurrencyName
FROM (VALUES ('USD','US Dollar'),('EUR','Euro'),('GBP','Pound Sterling'),('INR','Indian Rupee'),('AUD','Australian Dollar'),('CAD','Canadian Dollar')) v(CurrencyCode,CurrencyName)
WHERE NOT EXISTS (SELECT 1 FROM ref.Currency c WHERE c.CurrencyCode = v.CurrencyCode);

INSERT INTO ref.Country (CountryCode, CountryName, RegionName)
SELECT v.CountryCode, v.CountryName, v.RegionName
FROM (VALUES ('US','United States','North America'),('GB','United Kingdom','Europe'),('AU','Australia','APAC'),('IN','India','APAC'),('CA','Canada','North America'),('DE','Germany','Europe'),('FR','France','Europe'),('CH','Switzerland','Europe'),('JP','Japan','APAC'),('SG','Singapore','APAC')) v(CountryCode,CountryName,RegionName)
WHERE NOT EXISTS (SELECT 1 FROM ref.Country c WHERE c.CountryCode = v.CountryCode);

INSERT INTO ref.WorkflowPhase (PhaseCode, PhaseName, SequenceNo, Description)
SELECT v.PhaseCode, v.PhaseName, v.SequenceNo, v.Description
FROM (VALUES
 ('PRE_ENGAGEMENT','Client pre-engagement',1,'Inquiry, conflict check, staffing, opportunity and win'),
 ('INGESTION','Ingestion',2,'Pre-intake, intake, post-intake and mapping'),
 ('REVIEW','Review',3,'Early case assessment and detailed review'),
 ('PRODUCTION','Production',4,'Data processing, Bates numbering and production files'),
 ('ANALYTICS','Analytics',5,'Analytics and AI-enabled processing'),
 ('SECURITY_DETECT','Security detect/respond',6,'Monitor, triage, respond and remediate'),
 ('SECURITY_PREVENT','Security prevent/govern',7,'Harden, protect and govern'),
 ('SECURITY_VALIDATE','Security validate/recover',8,'Test controls, audit, assess third parties and recover')
) v(PhaseCode,PhaseName,SequenceNo,Description)
WHERE NOT EXISTS (SELECT 1 FROM ref.WorkflowPhase p WHERE p.PhaseCode = v.PhaseCode);

INSERT INTO ref.WorkflowState (WorkflowName, StateCode, StateName, IsTerminal)
SELECT v.WorkflowName, v.StateCode, v.StateName, v.IsTerminal
FROM (VALUES
 ('ClientServiceRequest','SUBMITTED','Submitted',0),
 ('ClientServiceRequest','ROUTED','Routed',0),
 ('ClientServiceRequest','PREMIER_REVIEW','Premier Review',0),
 ('ClientServiceRequest','CONCIERGE_SCOPING','Concierge Scoping',0),
 ('ClientServiceRequest','IT_TRIAGE','IT Triage',0),
 ('ClientServiceRequest','IN_PROGRESS','In Progress',0),
 ('ClientServiceRequest','BLOCKED','Blocked',0),
 ('ClientServiceRequest','DELIVERED','Delivered',0),
 ('ClientServiceRequest','DENIED','Denied',0),
 ('ClientServiceRequest','CLOSED','Closed',1),
 ('ClientServiceRequest','CANCELLED','Cancelled',1),
 ('PreEngagement','NEW','New',0),
 ('PreEngagement','CONFLICT_CHECK','Conflict Check',0),
 ('PreEngagement','STAFFING','Staffing',0),
 ('PreEngagement','SCOPING','Scoping',0),
 ('PreEngagement','CLOSED_WON','Closed Won',1),
 ('PreEngagement','DECLINED','Declined',1)
) v(WorkflowName,StateCode,StateName,IsTerminal)
WHERE NOT EXISTS (SELECT 1 FROM ref.WorkflowState s WHERE s.WorkflowName = v.WorkflowName AND s.StateCode = v.StateCode);

INSERT INTO service.ClientTier (TierCode, TierName, Description)
SELECT v.TierCode, v.TierName, v.Description
FROM (VALUES ('COBALT','Cobalt','Premium/custom service tier described in the workflow draft'),('PREMIER','Premier','Base/standardized service tier described in the workflow draft')) v(TierCode,TierName,Description)
WHERE NOT EXISTS (SELECT 1 FROM service.ClientTier t WHERE t.TierCode = v.TierCode);

INSERT INTO engagement.MatterType (MatterTypeCode, MatterTypeName)
SELECT v.MatterTypeCode, v.MatterTypeName
FROM (VALUES ('ENGAGEMENT','Engagement'),('DATA','Data')) v(MatterTypeCode,MatterTypeName)
WHERE NOT EXISTS (SELECT 1 FROM engagement.MatterType m WHERE m.MatterTypeCode = v.MatterTypeCode);

INSERT INTO edrm.DeliveryPhase (PhaseCode, PhaseName, SequenceNo, Purpose, EDRMGroup)
SELECT v.PhaseCode, v.PhaseName, v.SequenceNo, v.Purpose, v.EDRMGroup
FROM (VALUES
 ('EVIDENCE','Evidence / client data',1,'Client evidence, files and source data enter workflow','Evidence / collection'),
 ('COLLECTION','Evidence collection',2,'Collect/fetch data from devices and evidence sources','Collection'),
 ('PRE_INTAKE','Pre-intake and security',3,'Malware scanning and validation in isolated environment','Collection / preservation'),
 ('INTAKE','Intake',4,'Move clean files to Unix processing engine','Processing'),
 ('POST_INTAKE','Post-intake',5,'Document processing and reduction','Processing'),
 ('MAPPING','SnapLogic mapping',6,'Map processed data for downstream consumption','Processing'),
 ('REVIEW','Review',7,'Early case assessment, detailed review, hosting','Review'),
 ('PRODUCTION','Production',8,'Convert files, Bates number and produce deliverables','Production')
) v(PhaseCode,PhaseName,SequenceNo,Purpose,EDRMGroup)
WHERE NOT EXISTS (SELECT 1 FROM edrm.DeliveryPhase p WHERE p.PhaseCode = v.PhaseCode);

INSERT INTO edrm.EDRMStage (StageCode, StageName, SequenceNo, Description)
SELECT v.StageCode, v.StageName, v.SequenceNo, v.Description
FROM (VALUES
 ('IDENTIFY','Identification',1,'Identify potentially relevant information'),
 ('PRESERVE','Preservation',2,'Preserve evidence and chain of custody'),
 ('COLLECT','Collection',3,'Collect source data'),
 ('PROCESS','Processing',4,'Process and reduce collected data'),
 ('REVIEW','Review',5,'Review, tag and code documents'),
 ('ANALYZE','Analysis',6,'Analytics and relevance analysis'),
 ('PRODUCE','Production',7,'Create production deliverables'),
 ('PRESENT','Presentation',8,'Present evidence for proceedings')
) v(StageCode,StageName,SequenceNo,Description)
WHERE NOT EXISTS (SELECT 1 FROM edrm.EDRMStage s WHERE s.StageCode = v.StageCode);

INSERT INTO security.SecurityPhase (PhaseCode, PhaseName, SequenceNo, Objective)
SELECT v.PhaseCode, v.PhaseName, v.SequenceNo, v.Objective
FROM (VALUES
 ('DETECT_RESPOND','Detect / Respond',1,'Detect incidents and respond before impact'),
 ('PREVENT_GOVERN','Prevent / Govern',2,'Reduce attack surface and enforce controls'),
 ('VALIDATE_RECOVER','Validate / Recover',3,'Independently verify controls and recovery capability')
) v(PhaseCode,PhaseName,SequenceNo,Objective)
WHERE NOT EXISTS (SELECT 1 FROM security.SecurityPhase p WHERE p.PhaseCode = v.PhaseCode);
GO
