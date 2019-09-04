import React, { useState, useEffect } from "react"
import Error from "./ErrorMessage"
import styled from "styled-components"
import debounce from "lodash.debounce"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Images from "./Images"
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"

const TEAM_QUERY = gql`
  query TEAM_QUERY($name: String!) {
    team(where: { name: $name }) {
      id
      name
      players {
        id
        summonerName
        matches {
          id
          duration
        }
        stats {
          id
          champion
          kills
          deaths
          assists
          damage
          gold
        }
      }
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Box = styled.div`
  width: 100px;
  padding: 10px;
  margin: 5px;
`

const Division = styled.div`
  float: ${props => props.direction};
  width: 45%;
`

function ViewTeam() {
  const [teamName, setTeamName] = useState("")
  const [topThree, setTopThree] = useState({
    ["Summoner One"]: {
      ["x"]: 0,
    },
    ["Summoner Two"]: {
      ["x"]: 0,
    },
    ["Summoner Three"]: {
      ["x"]: 0,
    },
    ["Summoner Four"]: {
      ["x"]: 0,
    },
    ["Summoner Five"]: {
      ["x"]: 0,
    },
  })

  //Queries
  const { loading, data } = useQuery(TEAM_QUERY, {
    variables: { name: teamName },
  })

  const handleTeamNameChange = e => {
    setTeamName(e.target.value)
    if (data.team) {
    }
  }

  useEffect(() => {
    topChampions()
  }, [data])

  const topChampions = () => {
    let champions = {}
    if (data.team) {
      for (let player in Object.keys(data.team.players))
        for (let [key] in Object.keys(data.team.players[player]["stats"])) {
          let champion = data.team.players[player]["stats"][key]["champion"]
          let summoner = data.team.players[player]["summonerName"]
          if (champions[summoner] && champions[summoner][champion]) {
            champions = {
              ...champions,
              [summoner]: {
                [champion]: champions[summoner][champion] + 1,
              },
            }
          } else if (champions[summoner]) {
            champions = {
              ...champions,
              [summoner]: {
                ...champions[summoner],
                [champion]: 1,
              },
            }
          } else {
            champions = {
              ...champions,
              [summoner]: {
                [champion]: 1,
              },
            }
          }
        }
    } else {
      champions = {
        ["Summoner One"]: {
          ["x"]: 0,
        },
        ["Summoner Two"]: {
          ["x"]: 0,
        },
        ["Summoner Three"]: {
          ["x"]: 0,
        },
        ["Summoner Four"]: {
          ["x"]: 0,
        },
        ["Summoner Five"]: {
          ["x"]: 0,
        },
      }
    }

    setTopThree(champions)
  }

  return (
    <>
      <Column>
        <input
          type={"text"}
          id={"team"}
          name={"team"}
          placeholder={"Team Name"}
          value={teamName}
          onChange={e => handleTeamNameChange(e)}
        />
        <Row>
          {Object.entries(topThree).map(([player, val]) => (
            <Column key={player}>
              <Division direction="left" key={player}>
                <fieldset player="true" key={"fieldset" + String(player)}>
                  <legend>{player}</legend>
                  <Row>
                    <Box>Champions</Box>
                    <Box>Games Played</Box>
                  </Row>
                  {Object.entries(topThree[player]).map(([key, value]) => (
                    <Row key={"Row" + String(key)}>
                      <Box key={"box" + String(player)}>
                        <Images
                          src={`images/${key}.png`}
                          key={"Image" + String(key)}
                        />
                      </Box>
                      <Box>{value}</Box>
                    </Row>
                  ))}
                </fieldset>
              </Division>
            </Column>
          ))}
        </Row>
      </Column>
    </>
  )
}

const LoadingImageComponent = (loading, champion) => {
  console.log(champion.length)
  if (loading && champion.length > 2) {
    return <Images src={`images/${champion}.png`} />
  } else {
    return <ClimbingBoxLoader sizeUnit={"px"} size={10} color={"#123abc"} />
  }
}

export default ViewTeam
