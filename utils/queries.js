import { gql } from '@apollo/client';

export const GET_FEATURED_MERCHANTS = gql`
  query GetFeaturedMerchants {
    featuredMerchants {
      id
      businessName
      description
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      galleryImages {
        id
        url
      }
      slug
      category {
        nameAr
      }
      city {
        nameAr
      }
    }
  }
`;
export const GET_FEATURED_TRAINERS = gql`
  query GetFeaturedTrainers {
    featuredTrainers {
      id
      fullName
      specialization
      description
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      slug
      category {
        nameAr
      }
      city {
        nameAr
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      nameAr
      description
      icon
      merchantsCount
      isActive
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities {
    cities {
      id
      name
      nameAr
      isActive
    }
  }
`;

export const GET_MERCHANTS = gql`
  query GetMerchants($categoryId: ID, $cityId: ID, $search: String) {
    merchants(categoryId: $categoryId, cityId: $cityId, search: $search) {
      id
      businessName
      description
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      galleryImages {
        id
        url
      }
      slug
      phone
      whatsapp
      category {
        nameAr
      }
      city {
        nameAr
      }
    }
  }
`;

export const GET_MERCHANT_BY_SLUG = gql`
  query GetMerchantBySlug($slug: String!) {
    merchantBySlug(slug: $slug) {
      id
      businessName
      description
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      galleryImages {
        id
        url
      }
      phone
      whatsapp
      email
      website
      instagram
      workHours
      additionalNotes
      category {
        nameAr
      }
      city {
        nameAr
      }
    }
  }
`;

export const REGISTER_MERCHANT = gql`
  mutation RegisterMerchant($input: MerchantInput!) {
    registerMerchant(input: $input) {
      user {
        id
        fullName
        email
        role
        status
        isActive
        permissions
      }
    }
  }
`;

export const REGISTER_TRAINER = gql`
  mutation RegisterTrainer($input: TrainerInput!) {
    registerTrainer(input: $input) {
      user {
        id
        fullName
        email
        role
        status
        isActive
        permissions
      }
    }
  }
`;

export const GET_MERCHANTS_BY_CATEGORY = gql`
  query GetMerchantsByCategory($categoryId: ID!) {
    merchantsByCategory: merchants(categoryId: $categoryId) {
      merchants {
        id
        businessName
        description
        logo {
          id
          url
        }
        coverImage {
          id
          url
        }
        galleryImages {
          id
          url
        }
        slug
        phone
        whatsapp
        city {
          nameAr
        }
      }
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
`;

export const GET_TRAINERS_BY_CATEGORY = gql`
  query GetTrainersByCategory($categoryId: ID!) {
    trainersByCategory: trainers(categoryId: $categoryId) {
      trainers {
        id
        fullName
        specialization
        description
        logo {
          id
          url
          type
        }
        coverImage {
          id
          url
          type
        }
        galleryImages {
          id
          url
          type
          order
        }
        slug
        phone
        whatsapp
        city {
          nameAr
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      user {
        id
        fullName
        email
        role
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      user {
        id
        fullName
        email
        role
        status
        isActive
        permissions
      }
    }
  }
`;

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    pendingMerchantsCount: merchants(status: pending) {
      totalCount
    }
    pendingTrainersCount: trainers(status: pending) {
      totalCount
    }
    totalMerchants: merchants {
      totalCount
    }
    totalTrainers: trainers {
      totalCount
    }
    totalUsers: users {
      totalCount
    }
  }
`;

export const GET_PENDING_APPROVALS = gql`
  query GetPendingApprovals {
    pendingMerchants {
      id
      userId
      businessName
      description
      phone
      category {
        nameAr
      }
      city {
        nameAr
      }
      createdAt
    }
    pendingTrainers {
      id
      userId
      fullName
      specialization
      phone
      category {
        nameAr
      }
      city {
        nameAr
      }
      createdAt
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($page: Int, $limit: Int) {
    users(page: $page, limit: $limit) {
      users {
        id
        fullName
        email
        role
        isActive
        isFeatured
        createdAt
        merchant {
          id
          businessName
        }
        trainer {
          id
          fullName
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const APPROVE_MERCHANT = gql`
  mutation ApproveMerchant($id: ID!) {
    approveMerchant(id: $id) {
      id
      businessName
      status
    }
  }
`;

export const REJECT_MERCHANT = gql`
  mutation RejectMerchant($id: ID!) {
    rejectMerchant(id: $id) {
      id
      businessName
      status
    }
  }
`;

export const APPROVE_TRAINER = gql`
  mutation ApproveTrainer($id: ID!) {
    approveTrainer(id: $id) {
      id
      fullName
      status
    }
  }
`;

export const REJECT_TRAINER = gql`
  mutation RejectTrainer($id: ID!) {
    rejectTrainer(id: $id) {
      id
      fullName
      status
    }
  }
`;

export const TOGGLE_USER_STATUS = gql`
  mutation ToggleUserStatus($id: ID!, $isActive: Boolean!) {
    updateUser(id: $id, input: { isActive: $isActive }) {
      id
      success
      message
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      nameAr
      description
      icon
      order
      isActive
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      nameAr
      description
      icon
      order
      isActive
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const CREATE_CITY = gql`
  mutation CreateCity($input: CityInput!) {
    createCity(input: $input) {
      id
      name
      nameAr
      isActive
    }
  }
`;

export const UPDATE_CITY = gql`
  mutation UpdateCity($id: ID!, $input: CityInput!) {
    updateCity(id: $id, input: $input) {
      id
      name
      nameAr
      isActive
    }
  }
`;

export const DELETE_CITY = gql`
  mutation DeleteCity($id: ID!) {
    deleteCity(id: $id)
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      fullName
      email
      role
      createdAt
    }
  }
`;

export const GET_MY_MERCHANT = gql`
  query GetMyMerchant {
    myMerchant {
      id
      userId
      businessName
      description
      phone
      whatsapp
      email
      website
      instagram
      workHours
      additionalNotes
      address
      documentType
      verificationDocument
      status
      slug
      logo {
        id
        url
        type
      }
      coverImage {
        id
        url
        type
      }
      galleryImages {
        id
        url
        type
        order
      }
      category {
        id
        nameAr
      }
      city {
        id
        nameAr
      }
      createdAt
    }
  }
`;

export const GET_MY_TRAINER = gql`
  query GetMyTrainer {
    myTrainer {
      id
      fullName
      specialization
      description
      phone
      whatsapp
      email
      website
      instagram
      courses
      documentType
      additionalNotes
      status
      slug
      logo {
        id
        url
        type
      }
      coverImage {
        id
        url
        type
      }
      galleryImages {
        id
        url
        type
        order
      }
      category {
        id
        nameAr
      }
      city {
        id
        nameAr
      }
      createdAt
    }
  }
`;

export const GET_MERCHANTS_ADMIN = gql`
  query GetMerchants($status: ApprovalStatus) {
    merchants(status: $status) {
      merchants {
        id
        userId
        businessName
        description
        address
        phone
        whatsapp
        email
        website
        instagram
        workHours
        status
        isFeatured
        documentType
        verificationDocument
        additionalNotes
        slug
        category {
          nameAr
        }
        city {
          nameAr
        }
        user {
          id
          fullName
          email
          role
          isActive
          permissions
          createdAt
        }
        createdAt
        updatedAt
      }
      totalCount
      approvedCount
      pendingCount
      rejectedCount
    }
  }
`;

export const GET_TRAINERS_ADMIN = gql`
  query GetTrainers($status: ApprovalStatus) {
    trainers(status: $status) {
      trainers {
        id
        userId
        fullName
        specialization
        description
        phone
        whatsapp
        email
        website
        instagram
        courses
        status
        documentType
        verificationDocument
        additionalNotes
        isFeatured
        slug
        category {
          nameAr
        }
        city {
          nameAr
        }
        user {
          id
          fullName
          email
          role
          isActive
          permissions
          createdAt
        }
        createdAt
        updatedAt
      }
      totalCount
      approvedCount
      pendingCount
      rejectedCount
    }
  }
`;

export const UPDATE_MY_MERCHANT = gql`
  mutation UpdateMyMerchant($input: UpdateMerchantInput!) {
    updateMyMerchant(input: $input) {
      id
      businessName
      description
      phone
      whatsapp
      email
      website
      instagram
      workHours
      address
      documentType
      additionalNotes
      status
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      galleryImages {
        id
        url
      }
      category {
        id
        nameAr
      }
      city {
        id
        nameAr
      }
    }
  }
`;

export const UPDATE_MY_TRAINER = gql`
  mutation UpdateMyTrainer($input: UpdateTrainerInput!) {
    updateMyTrainer(input: $input) {
      id
      fullName
      specialization
      description
      phone
      whatsapp
      email
      website
      instagram
      courses
      documentType
      additionalNotes
      status
      logo {
        id
        url
      }
      coverImage {
        id
        url
      }
      galleryImages {
        id
        url
      }
      category {
        id
        nameAr
      }
      city {
        id
        nameAr
      }
    }
  }
`;

export const UPLOAD_LOGO = gql`
  mutation UploadLogo($file: Upload!) {
    uploadLogo(file: $file) {
      id
      url
      type
    }
  }
`;

export const UPLOAD_COVER_IMAGE = gql`
  mutation UploadCoverImage($file: Upload!) {
    uploadCoverImage(file: $file) {
      id
      url
      type
    }
  }
`;

export const GET_TRAINER_BY_SLUG = gql`
  query GetTrainerBySlug($slug: String!) {
    trainerBySlug(slug: $slug) {
      id
      fullName
      specialization
      description
      logo {
        id
        url
        type
      }
      coverImage {
        id
        url
        type
      }
      galleryImages {
        id
        url
        type
        order
      }
      phone
      whatsapp
      email
      website
      instagram
      courses
      category {
        nameAr
      }
      city {
        nameAr
      }
      createdAt
    }
  }
`;

export const SIGNOUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      success
      message
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query GetUserDetails($id: ID!) {
    user(id: $id) {
      id
      fullName
      email
      role
      permissions
      isActive
      isFeatured
      status
      createdAt
      updatedAt
      merchant {
        id
        userId
        categoryId
        cityId
        businessName
        description
        address
        phone
        whatsapp
        email
        website
        instagram
        logo {
          id
          url

          order
        }
        coverImage {
          id
          url

          order
        }
        galleryImages {
          id
          url

          order
        }
        workHours
        status
        isFeatured
        documentType
        verificationDocument
        additionalNotes
        slug
        category {
          id
          nameAr
          description
        }
        city {
          id
          nameAr
        }
        user {
          id
          fullName
          email
          role
        }
        createdAt
        updatedAt
      }
      trainer {
        id
        userId
        categoryId
        cityId
        fullName
        specialization
        description
        phone
        whatsapp
        email
        website
        instagram
        logo {
          id
          url

          order
        }
        coverImage {
          id
          url

          order
        }
        galleryImages {
          id
          url

          order
        }
        documentType
        verificationDocument
        additionalNotes
        courses
        status
        isFeatured
        slug
        category {
          id
          nameAr
          description
        }
        city {
          id
          nameAr
        }
        user {
          id
          fullName
          email
          role
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: ID!) {
    userPermissions(userId: $userId) {
      id
      fullName
      email
      role
      permissions
    }
  }
`;

export const UPDATE_USER_PERMISSIONS = gql`
  mutation UpdateUserPermissions($userId: ID!, $permissions: [String!]!) {
    updateUserPermissions(userId: $userId, permissions: $permissions) {
      id
      fullName
      email
      role
      permissions
      updatedAt
    }
  }
`;

export const GET_PERMISSIONS_CONFIG = gql`
  query GetPermissionsConfig {
    permissionsConfig {
      permissions {
        key
        name
        nameAr
        description
        category
      }
      permissionGroups {
        key
        name
        nameAr
        permissions
      }
    }
  }
`;

export const GET_USERS_WITH_PERMISSIONS = gql`
  query GetUsersWithPermissions {
    usersWithPermissions {
      id
      fullName
      email
      role
      permissions
      isActive
      createdAt
      merchant {
        id
        businessName
      }
      trainer {
        id
        fullName
      }
    }
  }
`;

export const VALIDATE_PASSWORD_TOKEN = gql`
  query ValidatePasswordToken($token: String!) {
    validatePasswordToken(token: $token) {
      valid
      email
      name
      message
    }
  }
`;

export const CREATE_PASSWORD = gql`
  mutation CreatePassword($token: String!, $password: String!) {
    createPassword(token: $token, password: $password) {
      success
      message
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      success
      message
      user {
        id
        fullName
        email
        role
        isActive
        permissions
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($page: Int, $limit: Int) {
    getAllCategories(page: $page, limit: $limit) {
      categories {
        id
        name
        nameAr
        description
        icon
        isActive
        order
        merchantsCount
        trainersCount
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ALL_FEATURED_MERCHANTS = gql`
  query GetAllFeaturedMerchants($page: Int, $limit: Int) {
    getAllFeaturedMerchants(page: $page, limit: $limit) {
      merchants {
        id
        businessName
        description
        slug
        logo {
          url
        }
        category {
          nameAr
        }
        city {
          nameAr
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_ALL_FEATURED_TRAINERS = gql`
  query GetAllFeaturedTrainers($page: Int, $limit: Int) {
    getAllFeaturedTrainers(page: $page, limit: $limit) {
      trainers {
        id
        fullName
        specialization
        description
        slug
        logo {
          url
        }
        category {
          nameAr
        }
        city {
          nameAr
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_APPROVED_TRAINERS_BY_CATEGORY = gql`
  query GetApprovedTrainersByCategory($categoryId: ID!, $limit: Int = 10, $offset: Int = 0) {
    approvedTrainersByCategory: approvedTrainers(
      categoryId: $categoryId
      limit: $limit
      offset: $offset
    ) {
      trainers {
        id
        fullName
        specialization
        description
        logo {
          id
          url
          type
        }
        coverImage {
          id
          url
          type
        }
        galleryImages {
          id
          url
          type
          order
        }
        slug
        phone
        whatsapp
        city {
          nameAr
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_APPROVED_MERCHANTS_BY_CATEGORY = gql`
  query GetMerchantsByCategory($categoryId: ID!) {
    approvedMerchantsByCategory: approvedMerchants(categoryId: $categoryId) {
      merchants {
        id
        businessName
        description
        logo {
          id
          url
        }
        coverImage {
          id
          url
        }
        galleryImages {
          id
          url
        }
        slug
        phone
        whatsapp
        city {
          nameAr
        }
      }
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
      totalCount
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
      url
    }
  }
`;

export const VALIDATE_RESET_TOKEN = gql`
  query validatePasswordToken($token: String!) {
    validatePasswordToken(token: $token) {
      valid
      email
      name
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($file: String!, $fileName: String, $folder: String) {
    uploadImage(file: $file, fileName: $fileName, folder: $folder) {
      url
      fileId
      success
    }
  }
`;



export const UPDATE_MERCHANT_GALLERY = gql`
  mutation UpdateMerchantGallery($input: UpdateGalleryInput!) {
    updateMerchantGallery(input: $input) {
      success
      galleryImages {
        id
        url
        type
        order
      }
    }
  }
`;
