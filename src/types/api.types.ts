/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AccessTokenCreateDto {
  expiresIn: string;
  secret?: string;
}

export interface AccessTokenResponseDto {
  accessToken: string;
}

export interface AdminAnalyzeSourceJobDto {
  /** @default true */
  async?: object;
  retool?: RetoolUserSelectDto;
}

export interface AdminAnalyzeUploadJobDto {
  /** @default true */
  async?: object;
  retool?: RetoolUserSelectDto;
}

export interface AdminCoverCreateDto {
  compositionId?: number;
  pageCount?: number;
  sourceId: number;
}

export interface AdminCoverSelectDto {
  url: string;
}

export interface AdminCreateAudioFromSourceJobDto {
  /** @default true */
  async?: object;
  /** @default "tts-1" */
  model?: OpenAIModel;
  retool?: RetoolUserSelectDto;
  /** @default 1 */
  speed?: number;
  /** @default "alloy" */
  voice?: OpenAIVoices;
}

export interface AdminDeleteDto {
  deletedBy: string;
  deletedReason?: string;
}

export interface AdminOnDemandSourcesDto {
  audioEnabled?: boolean;
  languages: string[];
}

export interface AdminPublishSourceDto {
  published: boolean;
}

export interface AdminPublisherNestedSelectDto {
  id: string;
  name: string;
}

export interface AdminPublisherNestedUpdateDto {
  id?: string;
}

export interface AdminPublisherSelectDto {
  id: string;
  name: string;
}

export interface AdminSourceAudioSelectDto {
  availability: AdminSourceAudioSelectDtoAvailabilityEnum;
  availablePassageCount: number;
  enabled: boolean;
}

export enum AdminSourceAudioSelectDtoAvailabilityEnum {
  ALL = "ALL",
  PARTIAL = "PARTIAL",
  NONE = "NONE",
}

export interface AdminSourceDeleteDto {
  id: number;
}

export interface AdminSourceLabelSelectDto {
  id: number;
  label: string;
}

export interface AdminSourceNestedSelectDto {
  audio: AdminSourceAudioSelectDto;
  availablePassageCount: number;
  childSources: string[];
  /** @format date-time */
  createdAt: string;
  decodeAvailability: AdminSourceNestedSelectDtoDecodeAvailabilityEnum;
  decodeEnabled: boolean;
  decompositionId?: number;
  /** @format date-time */
  deletedAt?: string;
  highlightModeEnabled: boolean;
  id: number;
  isMarkedForDeletion: boolean;
  isbn?: string;
  languageCode: string;
  level: AdminSourceNestedSelectDtoLevelEnum;
  lexileLevel: number;
  lexileLevelFormatted: string;
  memo: string;
  metadata?: object;
  parentSourceId?: number;
  passageCount: number;
  price?: number;
  priceManual?: number;
  readerMetadata?: AdminSourceReaderMetadataUpdateDto;
  readerPublished: boolean;
  rootSourceId: number;
  sourceToc?: object;
  status: AdminSourceNestedSelectDtoStatusEnum;
  titleId: string;
  /** @format date-time */
  updatedAt: string;
  uploadId?: number;
}

export enum AdminSourceNestedSelectDtoDecodeAvailabilityEnum {
  ALL = "ALL",
  NONE = "NONE",
  PARTIAL = "PARTIAL",
}

export enum AdminSourceNestedSelectDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export enum AdminSourceNestedSelectDtoStatusEnum {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  ON_DEMAND = "ON_DEMAND",
  PENDING = "PENDING",
}

export interface AdminSourceNestedUpdateDto {
  id: number;
}

export interface AdminSourceReaderMetadataUpdateDto {
  previewThreshold?: number;
  readingEase?: number;
  totalWords?: number;
  uniqueWords?: number;
}

export interface AdminSourceSelectDto {
  audio: AdminSourceAudioSelectDto;
  availablePassageCount: number;
  childSources: string[];
  /** @format date-time */
  createdAt: string;
  decodeAvailability: AdminSourceSelectDtoDecodeAvailabilityEnum;
  decodeEnabled: boolean;
  decompositionId?: number;
  /** @format date-time */
  deletedAt?: string;
  highlightModeEnabled: boolean;
  id: number;
  isMarkedForDeletion: boolean;
  isbn?: string;
  languageCode: string;
  level: AdminSourceSelectDtoLevelEnum;
  lexileLevel: number;
  lexileLevelFormatted: string;
  memo: string;
  metadata?: object;
  parentSourceId?: number;
  passageCount: number;
  price?: number;
  priceManual?: number;
  readerMetadata?: AdminSourceReaderMetadataUpdateDto;
  readerPublished: boolean;
  rootSourceId: number;
  sourceToc?: object;
  status: AdminSourceSelectDtoStatusEnum;
  title?: AdminTitleNestedSelectDto;
  titleId: string;
  /** @format date-time */
  updatedAt: string;
  uploadId?: number;
}

export enum AdminSourceSelectDtoDecodeAvailabilityEnum {
  ALL = "ALL",
  NONE = "NONE",
  PARTIAL = "PARTIAL",
}

export enum AdminSourceSelectDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export enum AdminSourceSelectDtoStatusEnum {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  ON_DEMAND = "ON_DEMAND",
  PENDING = "PENDING",
}

export interface AdminSourceTocPartDto {
  name?: string;
  position: number;
  sections: AdminSourceTocSectionDto[];
}

export interface AdminSourceTocSectionDto {
  name: string;
  passagePosition: number;
  position: number;
}

export interface AdminSourceTocUpdateDto {
  level?: string;
  parts?: AdminSourceTocPartDto[];
  subtitle?: string;
}

export interface AdminSourceUpdateDto {
  isbn?: string;
  languageCode?: string;
  level?: AdminSourceUpdateDtoLevelEnum;
  lexileLevel?: number;
  memo?: string;
  priceManual?: number;
  readerMetadata?: AdminSourceReaderMetadataUpdateDto;
  readerPublished?: boolean;
  titleId?: string;
  toc?: AdminSourceTocUpdateDto;
}

export enum AdminSourceUpdateDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export interface AdminSourcesLabelsSelectDto {
  sources: AdminSourceLabelSelectDto[];
}

export interface AdminSourcesSelectDto {
  meta: PaginationDto;
  sources: AdminSourceSelectDto[];
}

export interface AdminTitleCoverSelectDto {
  accentColor?: string;
  fullUrl?: string;
  rawUrl?: string;
  thumbnailUrl?: string;
}

export interface AdminTitleCoverUpdateDto {
  accentColor?: string;
  tempImageUrl?: string;
}

export interface AdminTitleCreateDto {
  author: string;
  cover?: AdminTitleCoverUpdateDto;
  memo?: string;
  priceManual?: number;
  primarySource?: AdminSourceNestedUpdateDto;
  publisher?: AdminPublisherNestedUpdateDto;
  readerMetadata?: AdminTitleReaderMetadataDto;
  slug: string;
  title: string;
  version: string;
}

export interface AdminTitleLevelCountDto {
  count: number;
  level: string;
}

export interface AdminTitleNestedSelectDto {
  author: string;
  id: string;
  slug: string;
  title: string;
  version: string;
}

export interface AdminTitlePublishDto {
  published: boolean;
}

export interface AdminTitleReaderMetadataDto {
  availability?: ReaderAvailability;
  badges?: TitleBadgeDto[];
  infoData?: TitleInfoDataDto[];
  visibility?: ReaderVisibility;
}

export interface AdminTitleSelectDto {
  author: string;
  authorSort: string;
  cover?: AdminTitleCoverSelectDto;
  createdAt: string;
  /** @format date-time */
  deletedAt?: string;
  editions?: EditionSelectDto[];
  fullStoreUrl?: string;
  id: string;
  isMarkedForDeletion: boolean;
  levelCounts: AdminTitleLevelCountDto[];
  memo?: string;
  price?: number;
  priceManual?: number;
  primarySource: AdminSourceNestedSelectDto;
  primarySourceId: number;
  published: boolean;
  publisher: AdminPublisherNestedSelectDto;
  readerMetadata?: AdminTitleReaderMetadataDto;
  readerUrl: string;
  renderingMode?: string;
  shopifySettings?: AdminTitleShopifySettingsDto;
  shortcuts: TocShortcutDto[];
  slug: string;
  title: string;
  titleSort: string;
  updatedAt: string;
  version: string;
}

export interface AdminTitleSettingsDto {
  audio?: boolean;
  languages?: string[];
  levels?: string[];
}

export interface AdminTitleShopifyDataDto {
  autoSync?: boolean;
  productId?: string;
}

export interface AdminTitleShopifySettingsDto {
  adminUrl?: string;
  autoSync?: boolean;
  productId?: string;
  storeUrl?: string;
}

export interface AdminTitleUpdateDto {
  author?: string;
  authorSort: string;
  cover?: AdminTitleCoverUpdateDto;
  memo?: string;
  priceManual?: number;
  primarySource?: AdminSourceNestedUpdateDto;
  publisher?: AdminPublisherNestedUpdateDto;
  readerMetadata?: AdminTitleReaderMetadataDto;
  renderingMode?: string;
  shopifyData?: AdminTitleShopifyDataDto;
  slug?: string;
  title?: string;
  titleSort?: string;
  version?: string;
}

export interface AdminTitleWithLabelSelectDto {
  id: string;
  label: string;
}

export interface AdminTitlesSelectDto {
  meta: PaginationDto;
  titles: AdminTitleSelectDto[];
}

export interface AdminTitlesWithLabelsSelectDto {
  titles: AdminTitleWithLabelSelectDto[];
}

export interface AdminUploadCreateDto {
  /** @default true */
  async?: object;
  /** @default true */
  autoDecompose?: object;
  languageCode: string;
  level: AdminUploadCreateDtoLevelEnum;
  retool?: RetoolUserSelectDto;
  titleId: string;
  type: UploadType;
}

export enum AdminUploadCreateDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export interface AdminUploadSelectDto {
  createdAt: object;
  id: string;
  metadata: object;
  status: string;
  title?: AdminTitleNestedSelectDto;
  type: UploadType;
  updatedAt: object;
  url: string;
}

export interface AdminUserListSelectDto {
  /** @format date-time */
  createdAt: string;
  email: string;
  features: string[];
  groupCode: string;
  id: string;
  organizationId: string;
  /** @format date-time */
  updatedAt: string;
}

export interface AdminUserSelectDto {
  /** @format date-time */
  createdAt: string;
  email: string;
  features: string[];
  groupCode: string;
  id: string;
  organizationId: string;
  /** @format date-time */
  updatedAt: string;
}

export type AdminUserUpdateDto = object;

export interface AdminUsersSelectDto {
  meta: PaginationDto;
  users: AdminUserListSelectDto[];
}

export interface AppAccessTokenCreateDto {
  expiresIn: string;
  secret?: string;
}

export interface AppUploadWithTitleCreateDto {
  /** @default true */
  async?: object;
  /** @default true */
  autoDecompose?: object;
  languageCode: string;
  level: AppUploadWithTitleCreateDtoLevelEnum;
  retool?: RetoolUserSelectDto;
  title: AdminTitleCreateDto;
  type: UploadType;
}

export enum AppUploadWithTitleCreateDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export interface ApprovalSelectDto {
  approver: string;
  createdAt: string;
  passageId: number;
}

export interface AudioOnlyPassageDto {
  audio?: AudioSelectDto;
  id: number;
  imageUrl?: string;
  partName?: string;
  position: number;
  sectionName: string;
  text: string;
  textDecoded: string;
}

export interface AudioSelectDto {
  audioLength: number;
  speechMarks: number[];
  url: string;
}

export interface AuthorSelectDto {
  id: number;
  name: string;
}

export interface BackfillShopifyDto {
  /** @default true */
  async?: object;
}

export interface BadgeSelectDto {
  label: string;
  theme?: string;
}

export interface ChatGptTranslationCreateDto {
  /** @default true */
  async?: object;
  maxTokens?: number;
  memo?: string;
  retool?: RetoolUserSelectDto;
  sourceId: number;
  translateSectionNames?: boolean;
  translationPromptId: string;
  translatorOptions?: OpenAiTranslatorDto;
}

export interface CompositionCreateDto {
  /** @default true */
  async?: object;
  /** @default "NotoSerif" */
  fontFamily?: FontFamily;
  /** @default "MEDIUM" */
  fontSize?: FontSize;
  memo?: string;
  passageMarkerPrefix?: string;
  renderBothSectionNames?: boolean;
  renderMetadata?: boolean;
  renderOriginalsInline?: boolean;
  renderPassageMarkers?: boolean;
  renderSourceDetails?: boolean;
  retool?: RetoolUserSelectDto;
  sourceId: number;
  stripTags?: boolean;
  type: CompositionType;
}

export interface CompositionLabelSelectDto {
  id: number;
  label: string;
}

export interface CompositionLabelsSelectDto {
  compositions: CompositionLabelSelectDto[];
  meta: PaginationDto;
}

export interface CompositionSelectDto {
  /** @format date-time */
  createdAt: string;
  documentUrl: string;
  id: number;
  memo: string;
  source: AdminSourceSelectDto;
  status: string;
}

export enum CompositionType {
  PDF = "PDF",
  PDF_PAPERBACK = "PDF_PAPERBACK",
  PLAINTEXT = "PLAINTEXT",
  VELLUM = "VELLUM",
  WORD = "WORD",
}

export interface CompositionsSelectDto {
  compositions: CompositionSelectDto[];
  meta: PaginationDto;
}

export interface CreateOnDemandSourceDto {
  languageCode: string;
  level: CreateOnDemandSourceDtoLevelEnum;
  version: string;
}

export enum CreateOnDemandSourceDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export interface CreateOrderDto {
  orderId: string;
  orderItems: OrderItemDto[];
  reorderId: string;
  reorderReason: string;
  shippingAddress: ShippingAddressDto;
}

export interface DecompositionCreateDto {
  /** @default true */
  async?: object;
  memo?: string;
  options?: DecompositionOptionsDto;
  retool?: RetoolUserSelectDto;
  uploadId?: string;
}

export interface DecompositionOptionsDto {
  /** @default 1500 */
  maxExcerptCharacters?: object;
  splitEveryParagraph?: object;
}

export interface DecompositionSelectDto {
  /** @format date-time */
  createdAt: string;
  id: string;
  options: object;
  source: AdminSourceSelectDto;
  status: string;
  upload: AdminUploadSelectDto;
}

export interface DecompositionsSelectDto {
  decompositions: DecompositionSelectDto[];
  meta: PaginationDto;
}

export enum DeepLFormality {
  Default = "default",
  More = "more",
  Less = "less",
}

export interface DeepLTranslationCreateDto {
  /** @default true */
  async?: object;
  audioEnabled?: object;
  maxTokens?: number;
  memo?: string;
  onDemand?: object;
  retool?: RetoolUserSelectDto;
  sourceId: number;
  targetLanguageCode: string;
  translateSectionNames?: boolean;
  translatorOptions?: DeepLTranslatorDto;
}

export interface DeepLTranslatorDto {
  /** @default "default" */
  formality?: DeepLFormality;
  preserveFormatting?: boolean;
}

export interface EditionLanguageDto {
  code: string;
  name: string;
  rightToLeft: boolean;
}

export interface EditionPassageDto {
  audio?: AudioSelectDto;
  id: number;
  imageUrl?: string;
  partName?: string;
  position: number;
  sectionName: string;
  text: string;
  textDecoded: string;
}

export interface EditionReaderMetadataDto {
  readingEase: number;
  totalWords: number;
  uniqueWords: number;
}

export interface EditionSelectDto {
  audioEnabled: boolean;
  audioTotalLength: number;
  decodeEnabled: boolean;
  highlightModeEnabled: boolean;
  id: number;
  language: EditionLanguageDto;
  languageCode: string;
  level: SourceLevel;
  lexileLevelFormatted: string;
  metadata: EditionReaderMetadataDto;
  passageCount: number;
  previewThreshold: number;
  readingEase: number;
  shortcuts?: string[];
  sourceId: number;
  status: string;
}

export interface ErrorResponseDto {
  errors?: ValidationErrorDto[];
}

export interface FindTextPassageDto {
  exactMatch?: boolean;
  passageIds?: string[];
  search: string;
  sourceId: number;
}

export interface FlagSelectDto {
  createdAt: string;
  memo: string;
  passageId: number;
  source: string;
}

export enum FontFamily {
  NotoSerif = "NotoSerif",
  NotoSans = "NotoSans",
}

export enum FontSize {
  EXTRA_LARGE = "EXTRA_LARGE",
  LARGE = "LARGE",
  LARGE_PRINT = "LARGE_PRINT",
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
}

export interface GcpTranslationCreateDto {
  /** @default true */
  async?: object;
  maxTokens?: number;
  memo?: string;
  retool?: RetoolUserSelectDto;
  sourceId: number;
  targetLanguageCode: string;
  translateSectionNames?: boolean;
}

export interface GetCompositionsLabelsParams {
  sourceId: number;
  type?: string;
}

export interface GetCompositionsParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
  sourceId?: number;
  titleId?: string;
}

export interface GetDecompositionsParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
  sourceId?: number;
  titleId?: string;
  uploadId?: string;
}

export interface GetJobsAnalyticsParams {
  /** @format date-time */
  endDate: string;
  queue: string;
  /** @format date-time */
  startDate: string;
}

export interface GetJobsParams {
  limit: number;
  page: number;
  query?: string;
  queue?: any;
  referenceId?: string;
  referenceType?: any;
  sortColumn?: string;
  sortDirection?: string;
  status?: any;
}

export interface GetOrdersParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
}

export interface GetPassageForAudioOnlyParams {
  editionId: number;
  position: number;
}

export interface GetPassageParams1 {
  editionId: number;
  position: number;
}

export interface GetPassageVersionsParams {
  position: number;
  sourceId: number;
}

export interface GetPassagesParams {
  approver?: string;
  flagged?: boolean;
  mineApproval?: boolean;
  notMineApproval?: boolean;
  oneApproval?: boolean;
  preferred?: boolean;
  sourceId: number;
  twoPlusApprovals?: boolean;
  zeroApprovals?: boolean;
}

export interface GetQrCodesParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
}

export interface GetQueueParams {
  queue: string;
}

export interface GetReaderTitleParams {
  titleSlug: string;
  version: string;
}

export interface GetSourcesLabelsParams {
  status?: string;
  titleId?: string;
}

export interface GetSourcesParams {
  languageCode?: string;
  level?: string;
  limit: number;
  page: number;
  published?: boolean;
  query?: string;
  rootSourceId?: number;
  sortColumn?: string;
  sortDirection?: string;
  sourceId?: number;
  titleId?: string;
  uploadId?: string;
}

export interface GetTitlesParams {
  limit: number;
  page: number;
  published?: boolean;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
}

export interface GetTranslationPromptsParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
  status?: StatusEnum;
}

export enum GetTranslationPromptsParams1StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface GetTranslationsParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
  sourceId?: number;
  status?: string;
}

export interface GetUploadsParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
  titleId?: string;
  uploadId?: string;
}

export interface GetUsersParams {
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
}

export interface InfoDataSelectDto {
  body: string;
  slug?: string;
  title?: string;
}

export interface JobSelectDto {
  /** @format date-time */
  createdAt: string;
  error?: object;
  id: number;
  params?: object;
  queue: string;
  referenceId?: number;
  referenceType?: string;
  retoolUser?: object;
  retrySchema?: string[];
  status: string;
  times: object;
  type: string;
  /** @format date-time */
  updatedAt: string;
}

export interface JobsAnalyticsSelectDto {
  currentQueuedCount: number;
  jobsByStatus: object;
  lineChartData: string[];
  queueHealth: QueueHealth;
  totalJobs: number;
}

export interface JobsSelectDto {
  jobs: JobSelectDto[];
  meta: PaginationDto;
}

export interface LanguageCreateDto {
  iso6391?: string;
  audioAvailable: boolean;
  code: string;
  deeplCode?: string;
  gcpCode?: string;
  name: string;
  rightToLeft: boolean;
}

export interface LanguageRetoolRowUpdateDto {
  iso6391?: string;
  audioAvailable: boolean;
  code: string;
  deeplCode?: string;
  name: string;
  rightToLeft: boolean;
  status: string;
}

export interface LanguageRetoolTableUpdateDto {
  changeSet: LanguageRetoolRowUpdateDto[];
}

export interface LanguageSelectDto {
  iso6391?: string;
  audioAvailable: boolean;
  code: string;
  deeplCode?: string;
  gcpCode?: string;
  name: string;
  rightToLeft: boolean;
  status: string;
}

export interface LanguageUpdateDto {
  iso6391?: string;
  audioAvailable: boolean;
  deeplCode?: string;
  name: string;
  rightToLeft: boolean;
}

export interface LanguagesSelectDto {
  languages: LanguageSelectDto[];
}

export interface MatchTextPassageDto {
  match: string;
  passageId: number;
  position: number;
  search: string;
  text: string;
  textPosition: number;
}

export interface MatchTextPassageResponseDto {
  matches: MatchTextPassageDto[];
}

export enum OpenAIMode {
  Chat = "chat",
  Tts = "tts",
}

export enum OpenAIModel {
  Tts1 = "tts-1",
  Tts1Hd = "tts-1-hd",
}

export enum OpenAIVoices {
  Alloy = "alloy",
  Echo = "echo",
  Fable = "fable",
  Onyx = "onyx",
  Nova = "nova",
  Shimmer = "shimmer",
}

export interface OpenAiTranslatorDto {
  /** @default "chat" */
  mode?: OpenAIMode;
  /** @default "gpt-3.5-turbo" */
  model?: OpenAIModel;
}

export type Order = object;

export interface OrderInProgressDto {
  orderId: string;
  orderItems: OrderItemDto[];
  reorderId: string;
  reorderReason: string;
}

export interface OrderItemDto {
  author: string;
  coverUrl: string;
  isColor: boolean;
  pdfUrl: string;
  price: number;
  quantity: number;
  title: string;
}

export interface OrderSelectDto {
  /** @format date-time */
  createdAt: string;
  id: string;
  orderData: object;
  reorderId: string;
  rpiOrderId: string;
  status: string;
  /** @format date-time */
  updatedAt: string;
}

export interface OrdersSelectDto {
  meta: PaginationDto;
  orders: OrderSelectDto[];
}

export interface PaginationDto {
  count: number;
  limit: number;
  page: number;
  query?: string;
  sortColumn?: string;
  sortDirection?: string;
}

export interface PassageApproveDto {
  approver: string;
}

export interface PassageAudioDto {
  /** @default true */
  async?: object;
  languageCode: string;
  /** @default "tts-1" */
  model?: OpenAIModel;
  /** @default 1 */
  speed?: object;
  /** @default "alloy" */
  voice?: OpenAIVoices;
}

export interface PassageAudioOnDemandDto {
  /** @default false */
  async?: object;
  /** @default "tts-1" */
  model?: OpenAIModel;
  /** @default 1 */
  speed?: object;
  /** @default "alloy" */
  voice?: OpenAIVoices;
}

export interface PassageDecodeResponseDto {
  textDecoded: string;
}

export interface PassageEditorDto {
  position: number;
  sourceId: number;
  version?: number;
}

export interface PassageFlagDto {
  memo: string;
  source: string;
}

export interface PassageFlaggedPhrasesDto {
  /** @default true */
  async?: object;
  passageIds?: string[];
  retool?: RetoolUserSelectDto;
  sourceIds?: string[];
}

export interface PassageReTranslateDto {
  translationId?: number;
  translationPromptId?: string;
}

export interface PassageSectionSelectDto {
  content: string;
  id: string;
  position: number;
  title: string;
}

export interface PassageSelectDto {
  approvals: ApprovalSelectDto[];
  author: AuthorSelectDto;
  createdAt: string;
  flags: FlagSelectDto[];
  id: number;
  imageUrl: string;
  metadata: object;
  parentPassageId?: number;
  part: number;
  passageTranslation?: PassageTranslationSelectDto;
  position: number;
  preferred: boolean;
  rawSection?: PassageSectionSelectDto;
  section: number;
  sourceId: number;
  status: Status;
  text: string;
  textDecoded?: string;
  version: number;
}

export interface PassageTranslateDto {
  translationId: number;
  translationPromptId?: string;
}

export interface PassageTranslationSelectDto {
  rawRequest: object;
  rawResponse: object;
  translation: TranslationSelectDto;
  translationPrompt: TranslationPromptSelectDto;
}

export interface PassageUploadAudioDto {
  audioUrl: string;
}

export interface PassageUploadImageDto {
  sourceSpecific: boolean;
  tempImageUrl: string;
}

export interface PassageVersionCreateDto {
  author: string;
  text: string;
}

export interface PassageVersionsResponseDto {
  versions: PassageSelectDto[];
}

export interface PassagesSelectDto {
  passages: PassageSelectDto[];
}

export interface PdfCompositionCreateDto {
  /** @default true */
  async?: object;
  retool?: RetoolUserSelectDto;
  secondarySourceId?: number;
  sourceId: number;
}

export interface QrCodeCreateDto {
  memo?: string;
  url: string;
}

export interface QrCodeRedirectDto {
  code: string;
  url: string;
}

export interface QrCodeSelectDto {
  code: string;
  /** @format date-time */
  createdAt: string;
  imageData?: string;
  memo: string;
  /** @format date-time */
  updatedAt: string;
  url: string;
}

export interface QrCodesSelectDto {
  meta: PaginationDto;
  qrCodes: QrCodeSelectDto[];
}

export interface QueueHealth {
  health: string;
}

export interface QueueStatusSelectDto {
  status: string;
}

export enum ReaderAvailability {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}

export enum ReaderVisibility {
  HIDDEN = "HIDDEN",
  VISIBLE = "VISIBLE",
}

export interface ReplaceTextPassageDto {
  /** @default true */
  async?: object;
  author: string;
  exactMatch?: boolean;
  passageIds: string[];
  replace: string;
  retool?: RetoolUserSelectDto;
  search: string;
}

export interface RetoolUserSelectDto {
  email: string;
  fullName: string;
  id: number;
}

export interface RpiWebhookDto {
  Message: string;
  OrderID: string;
  Status: string;
}

export interface ShippingAddressDto {
  address: string;
  city: string;
  country: string;
  email: string;
  method: string;
  name: string;
  phone: string;
  postal: string;
  state: string;
}

export enum SourceLevel {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export interface SpeechMarksResponseDto {
  speechMarks: object;
}

export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  PENDING = "PENDING",
}

export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TitleBadgeDto {
  label: string;
  theme?: string;
}

export interface TitleDefaultReader {
  left: TitleDefaultReaderColumn;
  right?: TitleDefaultReaderColumn;
}

export interface TitleDefaultReaderColumn {
  language: string;
  level: SourceLevel;
}

export interface TitleExtendedSelectDto {
  author: string;
  availability: ReaderAvailability;
  badges?: BadgeSelectDto[];
  defaultReader?: TitleDefaultReader;
  editions?: EditionSelectDto[];
  infoData?: InfoDataSelectDto[];
  languages: LanguageSelectDto[];
  levels: SourceLevel[];
  renderingMode?: string;
  shopifyStoreUrl?: string;
  shortcuts: TocShortcutDto[];
  slug: string;
  thumbnailImageUrl: string;
  title: string;
  titleSort: string;
  version: string;
}

export interface TitleInfoDataDto {
  body: string;
  slug: string;
  title: string;
}

export interface TitleListItemSelectDto {
  author: string;
  availability: ReaderAvailability;
  badges?: BadgeSelectDto[];
  languages: LanguageSelectDto[];
  levels: SourceLevel[];
  renderingMode?: string;
  shortcuts: TocShortcutDto[];
  slug: string;
  thumbnailImageUrl: string;
  title: string;
  titleSort: string;
  version: string;
}

export interface TitlesSelectDto {
  publications: TitleListItemSelectDto[];
}

export interface TocShortcutDto {
  name: string;
  passage: number;
}

export interface ToggleQueueDto {
  queue: string;
  toggle: boolean;
}

export interface TranslationPromptCreateDto {
  gradeLevel?: number;
  languageCode: string;
  level: TranslationPromptCreateDtoLevelEnum;
  name: string;
  prompt: string;
  status?: TranslationPromptCreateDtoStatusEnum;
}

export enum TranslationPromptCreateDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export enum TranslationPromptCreateDtoStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TranslationPromptDto {
  id: number;
  name: string;
  prompt: string;
}

export interface TranslationPromptSelectDto {
  /** @format date-time */
  createdAt: string;
  gradeLevel?: number;
  id: string;
  languageCode: string;
  level: TranslationPromptSelectDtoLevelEnum;
  name: string;
  prompt: string;
  status: TranslationPromptSelectDtoStatusEnum;
  /** @format date-time */
  updatedAt: string;
}

export enum TranslationPromptSelectDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export enum TranslationPromptSelectDtoStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TranslationPromptUpdateDto {
  gradeLevel?: number;
  languageCode?: string;
  level?: TranslationPromptUpdateDtoLevelEnum;
  name?: string;
  prompt?: string;
  status?: TranslationPromptUpdateDtoStatusEnum;
}

export enum TranslationPromptUpdateDtoLevelEnum {
  GOLD = "GOLD",
  ORIGINAL = "ORIGINAL",
  SILVER = "SILVER",
}

export enum TranslationPromptUpdateDtoStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TranslationPromptsSelectDto {
  meta: PaginationDto;
  translationPrompts: TranslationPromptSelectDto[];
}

export interface TranslationRetranslateDto {
  passageIds: string[];
  retool?: RetoolUserSelectDto;
}

export interface TranslationSelectDto {
  createdAt: string;
  id: number;
  memo: string;
  metadata?: object;
  options: object;
  parentSource: AdminSourceSelectDto;
  passages: any[][];
  shortcuts: TocShortcutDto[];
  source: AdminSourceSelectDto;
  status: string;
  translationPrompt: TranslationPromptDto;
  translatorOptions: object;
  type: string;
}

export interface TranslationUpdateDto {
  memo?: string;
}

export interface TranslationsSelectDto {
  meta: PaginationDto;
  translations: TranslationSelectDto[];
}

export enum UploadType {
  EPUB = "EPUB",
  EPUB3 = "EPUB3",
  EPUB_GOOGLE = "EPUB_GOOGLE",
  HTML5 = "HTML5",
  HTML = "HTML",
  KINDLE = "KINDLE",
  PLAINTEXT = "PLAINTEXT",
}

export interface UploadsSelectDto {
  meta: PaginationDto;
  uploads: AdminUploadSelectDto[];
}

export interface UserSelectDto {
  /** @format email */
  email: string;
  features: string[];
  groupCode: string;
  role: UserSelectDtoRoleEnum;
}

export enum UserSelectDtoRoleEnum {
  INDIVIDUAL = "INDIVIDUAL",
  TEACHER = "TEACHER",
}

export interface ValidationErrorDto {
  code: number;
  field: string;
  message: string;
}

export interface VisitorSelectDto {
  features: string[];
}
