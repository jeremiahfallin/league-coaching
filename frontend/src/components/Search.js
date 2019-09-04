import React, { useState } from "react"
import Downshift, { resetIdCounter } from "downshift"
import gql from "graphql-tag"
import debounce from "lodash.debounce"
import { useQuery } from "@apollo/react-hooks"
import { DropDown, DropDownTeam, SearchStyles } from "./styles/DropDown"

const SEARCH_TEAMS_QUERY = gql`
  query SEARCH_TEAMS_QUERY($searchTerm: String!) {
    teams(where: { name_contains: $searchTerm }) {
      id
      name
    }
  }
`

const SEARCH_PLAYERS_QUERY = gql`
  query SEARCH_PLAYERS_QUERY($searchTerm: String!) {
    players(where: { summonerName_contains: $searchTerm }) {
      id
      summonerName
    }
  }
`

function AutoComplete({ type }) {
  const [names, setNames] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const { loading, data } = useQuery(SEARCH_TEAMS_QUERY, {
    variables: { searchTerm: searchTerm },
  })

  const onChange = debounce(async e => {
    console.log("Searching. . .")
    setSearchTerm(e.target.value)
    setNames(
      type === "players" ? data.summonerNames : Object.values(data.teams)
    )
  }, 350)

  return (
    <SearchStyles>
      <Downshift itemToString={item => (item === null ? "" : item.name)}>
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <input
              {...getInputProps({
                type: "search",
                placeholder: type === "players" ? "Summoner Name" : "Team Name",
                id: "search",
                className: loading ? "loading" : "",
                onChange: e => {
                  e.persist()
                  onChange(e)
                },
              })}
            />
            {isOpen && (
              <DropDown>
                {names.map((item, index) => (
                  <DropDownTeam
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  />
                ))}
                {names.length > 0 && loading && (
                  <DropDownTeam>
                    No {type === "players" ? "player" : "team"} found for{" "}
                    {inputValue}
                  </DropDownTeam>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  )
}

export default AutoComplete
