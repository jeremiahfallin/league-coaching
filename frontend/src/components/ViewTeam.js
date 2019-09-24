import React, { useState, useEffect } from "react"
import Error from "./ErrorMessage"
import styled from "styled-components"
import debounce from "lodash.debounce"
import { gql } from "apollo-boost"
import { useQuery, useMutation } from "@apollo/react-hooks"
import Images from "./Images"

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
          stats {
            player {
              id
              summonerName
            }
            damage
            gold
            kills
            deaths
            assists
          }
        }
        stats {
          id
          champion
        }
      }
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Box = styled.div`
  width: 100%;
  padding: 10px;
  margin: 2px;
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
  const [stats, setStats] = useState({
    ["Summoner One"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Two"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Three"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Four"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
    ["Summoner Five"]: {
      ["kda"]: 0,
      ["gpm"]: 0,
      ["dpm"]: 0,
    },
  })

  //Queries
  const { data } = useQuery(TEAM_QUERY, {
    variables: { name: teamName },
  })

  const handleTeamNameChange = e => {
    setTeamName(e.target.value)
  }

  useEffect(() => {
    topChampions()
    getStats()
  }, [data])

  const getStats = () => {
    let playerStats = {}
    if (data.team) {
      for (let player in Object.keys(data.team.players)) {
        let playerID = data.team.players[player]["id"]
        for (let match in Object.keys(data.team.players[player]["matches"])) {
          let totalGold = 0,
            totalDamage = 0,
            totalDuration = 0,
            kills = 0,
            deaths = 0,
            assists = 0
          let game = data.team.players[player]["matches"][match]
          for (let stat in Object.keys(game["stats"])) {
            if (playerID === game["stats"][stat]["player"]["id"]) {
              totalGold += game["stats"][stat]["gold"]
              totalDamage += game["stats"][stat]["damage"]
              kills += game["stats"][stat]["kills"]
              deaths += game["stats"][stat]["deaths"]
              assists += game["stats"][stat]["assists"]
              totalDuration += game["duration"]
            }
          }
          totalDuration = totalDuration / 60
          playerStats = {
            ...playerStats,
            [data.team.players[player]["summonerName"]]: {
              ["gpm"]: totalGold / totalDuration,
              ["dpm"]: totalDamage / totalDuration,
              ["kda"]: (kills + deaths) / assists,
            },
          }
        }
      }
      setStats(playerStats)
    } else {
      setStats({
        ["Summoner One"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Two"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Three"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Four"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
        ["Summoner Five"]: {
          ["kda"]: 0,
          ["gpm"]: 0,
          ["dpm"]: 0,
        },
      })
    }
  }

  const topChampions = () => {
    let champions = {}
    if (data.team) {
      for (let player in Object.keys(data.team.players)) {
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
            <Row key={player}>
              <fieldset player="true" key={"fieldset" + String(player)}>
                <legend>{player}</legend>
                <Row>
                  <Box>
                    <div>KDA</div>
                    <div>{stats[player]["kda"].toFixed(2)}</div>
                  </Box>
                  <Box>
                    <div>DPM</div>
                    <div>{stats[player]["dpm"].toFixed(2)}</div>
                  </Box>
                  <Box>
                    <div>GPM</div>
                    <div>{stats[player]["gpm"].toFixed(2)}</div>
                  </Box>
                </Row>
                {Object.entries(topThree[player]).map(([key, value]) => (
                  <Row key={"Row" + String(key)}>
                    <Box key={"box" + String(player)}>
                      <Images
                        src={`images/${key}.png`}
                        key={"Image" + String(key)}
                      />
                    </Box>
                    <Box>{value} Played</Box>
                  </Row>
                ))}
              </fieldset>
            </Row>
          ))}
        </Row>
      </Column>
    </>
  )
}

export default ViewTeam
