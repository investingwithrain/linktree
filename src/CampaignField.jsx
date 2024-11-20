import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useHookstate } from '@hookstate/core';
import { globalSelectedCampaign } from './context';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    Timestamp,
  } from "firebase/firestore";

import { db } from "./main.jsx";
  

const filter = createFilterOptions();

export default function CampaignField() {
    const selectedCampaign = useHookstate(globalSelectedCampaign);
  const campaigns = useHookstate([]);
  const loading = useHookstate(false);

  const fetchCampaigns = async () => {
    const querySnapshot = await getDocs(collection(db, "Campaign"));
    const Campaigns = [];
    querySnapshot.forEach((doc) => {
        Campaigns.push(doc.data());
    });

    campaigns.set(Campaigns);
  };

  const generateCampaign = async () => {
    // console.log("selectedCampaign", selectedCampaign.get());
    loading.set(true);
    try {
        await setDoc(doc(db, "Campaign", selectedCampaign.get().id), {
            name: selectedCampaign.get().name,
            createdAt: Timestamp.now(),
        });
        fetchCampaigns();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    loading.set(false);
};


  if (campaigns.get().length === 0) {
    fetchCampaigns();
  }
  return (
    <Autocomplete
        fullWidth
      value={selectedCampaign.get().name}
      onChange={(event, newValue) => {

        // console.log("newValue", newValue);
        if (typeof newValue === 'string') {
            //try to create new value
            const formattedValue = newValue.toLowerCase().replace(/ /g, '_');
        
            selectedCampaign.set({
                id:formattedValue,
                name: newValue,
            });
            generateCampaign();
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          selectedCampaign.set({
            id:newValue.inputValue.toLowerCase().replace(/ /g, '_'),
            name: newValue.inputValue,
          });
          generateCampaign();
        } else if (newValue) {
            const formattedValue = newValue.name.toLowerCase().replace(/ /g, '_')
            console.log("newValue.id", formattedValue);
            console.log("newValue.name", newValue.name);
            selectedCampaign.set({
                id: formattedValue,
                name: newValue.name,
              });
        }
      }}
      filterOptions={(options, params) => {


        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.name);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            name: `Create New "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="campaign-name"
      options={campaigns.get()}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.name}
          </li>
        );
      }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Campaign Name*" />
      )}
    />
  );
}
