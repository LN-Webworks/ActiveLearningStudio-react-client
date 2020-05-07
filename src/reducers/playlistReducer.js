import { 
  CREATE_PLAYLIST,
  DELETE_PLAYLIST,
  SHOW_CREATE_PLAYLIST_MODAL,
  HIDE_CREATE_PLAYLIST_MODAL,
  CREATE_RESOURCE,
  LOAD_PROJECT_PLAYLISTS,
  LOAD_PLAYLIST,
  DELETE_RESOURCE,
  SHOW_DELETE_PLAYLIST_MODAL,
  HIDE_DELETE_PLAYLIST_MODAL
} from "../constants/actionTypes";

const defaultPlaylistState = () => {
  if (localStorage.getItem("playlists")) {

        
    return {
        'playlists':JSON.parse(localStorage.getItem("playlists")),
        'showCreatePlaylistPopup':false
    }
  } else {
    return {
        'playlists':[],
        'showCreatePlaylistPopup':false,
        selectedPlaylist: null,
    };
  }
};

const playlistReducer = (state = defaultPlaylistState(), action) => {
  switch (action.type) {
    case CREATE_PLAYLIST:
      return {
        ...state,
        playlists: [
          ...state.playlists,
          action.playlistdata
        ]
      };
    
    case DELETE_PLAYLIST:
      let newPlaylist = state.playlists.filter(playlist => {
        return playlist._id !== action.id
      });
      return {
        ...state,
        showDeletePlaylistPopup: false,
        playlists: newPlaylist
      };
    case SHOW_CREATE_PLAYLIST_MODAL:
      return {
        ...state,
        showCreatePlaylistPopup: true
      };
    case HIDE_CREATE_PLAYLIST_MODAL:
      return {
        ...state,
        showCreatePlaylistPopup: false
      };
    
    case CREATE_RESOURCE:
      // adding resource to newplaylist specific id
      // console.log(state.playlists)
      // console.log(action);
      let newPlaylists = state.playlists;
      state.playlists.forEach((playlist,i) => {
          if(playlist._id === action.playlistid){
            newPlaylists[i] = Object.assign( { 'resources':[] }, newPlaylists[i] );
            newPlaylists[i].resources.push({_id:action.resource.id, id:action.resource.mysqlid, title:action.resource.title});
          }
      });
      
          return {
              ...state,
              playlists: newPlaylists,
              showCreateResourcePopup:false
              
          };
      case DELETE_RESOURCE:
        
        let plists = [];
        state.playlists.forEach((playlist,i) => {
          let newResources = playlist.resources.filter(res => {
            return res._id !== action.resourceid
          });
          var p = null;
          p = playlist;
          p.resources = newResources;
          plists.push(p);
        });
        
        return {
          ...state,
          playlists: plists,
          showCreateResourcePopup:false,
          showDeletePlaylistPopup: false
          
      };
      case LOAD_PROJECT_PLAYLISTS:
        return {
          ...state,
          playlists: action.playlists
        };

      case LOAD_PLAYLIST:
        return {
          ...state,
          selectedPlaylist: action.playlist
        };
    default:
      return state;
  }
};

export default playlistReducer;
