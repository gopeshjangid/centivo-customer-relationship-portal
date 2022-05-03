import * as actionType from "../constants/constant.action";
import { _global } from "../helpers";
const defaultState = {
  loading: false,
  selectedProvider: null,
  providerList: [],
  providerListData: [],
  searchFilteredData: [],
  filter: {
    gender: "",
  },
  isFilterApplied: false,
  gMapKey: null,
  mapErrorMsg: "",
  initialFilter: {
    practitionarName: "",
    npi: "",
  },
  actionPage: "SEARCH",
  form: null,
};

const providerDirectory = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.FIND_MEMBER_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case actionType.SELECT_PROVIDER:
      return {
        ...state,
        selectedProvider: action.payload,
        loading: false,
        actionPage: "DETAIL",
      };
      break;
    case actionType.SAVE_PROVIDER_LIST:
      const list = action.payload.doctorList;
      const initialFilter = action.payload.filter;

      let filteredOutList = [];
      if (initialFilter.practitionarName !== "" || initialFilter.npi !== "") {
        filteredOutList = list.filter((provider) => {
          if (
            initialFilter.practitionarName &&
            initialFilter.npi === "" &&
            provider.firstName === initialFilter.practitionarName
          ) {
            return true;
          }

          if (
            initialFilter.practitionarName === "" &&
            initialFilter.npi &&
            provider.npi === initialFilter.npi
          ) {
            return true;
          }

          if (
            initialFilter.practitionarName &&
            initialFilter.npi &&
            provider.firstName === initialFilter.practitionarName &&
            provider.npi === initialFilter.npi
          ) {
            return true;
          }
        });
      } else {
        filteredOutList = Object.values(_global.groupBy(list, "practiceName"));
      }
      return {
        ...state,
        providerList: filteredOutList,
        providerListData: list,
        initialFilter: initialFilter,
        searchFilteredData: filteredOutList,
        form: action.payload.form,
        loading: false,
        filter: defaultState.filter
      };
      break;
    case actionType.FILTER_PROVIDER_LIST:
      const filter = action.payload;
      const filterKeys = Object.keys(filter);
      let filteredList = state.searchFilteredData.filter((provider) => {
        const isFiltered = filterKeys
          .filter((data) => data)
          .every((key) => {
            if (
              key === "distance" &&
              Number(provider.distance) <= Number(filter[key])
            ) {
              return true;
            }

            if (
              key === "gender" &&
              (filter[key] === "" || filter[key] === provider.gender)
            ) {
              return true;
            }

            if (filter[key] === "false" || !filter[key]  ||
              key === "isAcceptingNewPatients" &&
              filter[key] === provider.isAcceptingNewPatients
            ) {
              return true;
            }
          });

        return isFiltered;
      });

      return {
        ...state,
        providerList: filteredList,
        filter: { ...filter },
        loading: false,
        isFilterApplied: true,
      };
      break;
    case actionType.CLEAR_FILTER_PROVIDER_LIST:
      return {
        ...state,
        providerList: [...state.searchFilteredData],
        filter: defaultState.filter,
        loading: false,
        isFilterApplied: false,
      };
      break;
    case actionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      break;
    case actionType.GET_LOCATION_SUCCESS:
      return {
        ...state,
        gMapKey: action.payload.data.key,
        mapErrorMsg: "",
      };
      break;
    case actionType.GET_LOCATION_FAILURE:
      return {
        ...state,
        mapErrorMsg: "Map cannot be load",
      };
      break;

    case actionType.CLEAR_ALL_DATA:
      return {
        ...defaultState,
      };
      break;

    case actionType.CLEAR_SELECTED_PROVIDER:
      return {
        ...state,
        selectedProvider: null,
        actionPage: action.payload,
      };
      break;
    default:
      return state;
  }
};

export default providerDirectory;
