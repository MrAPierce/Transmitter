var defaultControls = [
  {
      "Type": "JoyStick",
      "Name": "Bucket-LArm",
      "SlaveOnly": false,
      "position": [
        88,
        110
      ],
      "size": [
        300,
        300
      ],
      "joySize": [
        65,
        65
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "Bucket",
            "channel": 1,
            "axis": "X",
            "enabled": true,
            "reverse": false,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        },
        {
            "name": "Boom",
            "channel": 0,
            "axis": "Y",
            "enabled": true,
            "reverse": true,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        }
      ]
  },
  {
      "Type": "JoyStick",
      "Name": "Slew-Boom",
      "position": [
        88,
        862
      ],
      "size": [
        300,
        300
      ],
      "joySize": [
        65,
        65
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "channelX",
            "channel": 3,
            "enabled": true,
            "axis": "X",
            "reverse": false,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        },
        {
            "name": "Arm",
            "channel": 2,
            "axis": "Y",
            "enabled": true,
            "reverse": true,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        }
      ]
  },
  {
      "Type": "JoyStick",
      "Name": "TrackRight",
      "position": [
        88,
        1171
      ],
      "size": [
        100,
        300
      ],
      "joySize": [
        65,
        65
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "channelX",
            "channel": 10,
            "axis": "X",
            "enabled": false,
            "reverse": false,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        },
        {
            "name": "Arm",
            "channel": 5,
            "axis": "Y",
            "enabled": true,
            "reverse": true,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        }
      ]
  },
  {
      "Type": "JoyStick",
      "Name": "TrackLeft",
      "position": [
        88,
        3
      ],
      "size": [
        100,
        300
      ],
      "joySize": [
        65,
        65
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "channelX",
            "channel": 10,
            "axis": "X",
            "enabled": false,
            "reverse": false,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        },
        {
            "name": "Arm",
            "channel": 6,
            "axis": "Y",
            "enabled": true,
            "reverse": true,
            "springTension": 150,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1,
                    "below": 1
                }
            }
        }
      ]
  },

  {
      "Type": "Slave",
      "Name": "Slave Servo Control1",
      "position": [
        580,
        320
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "Servo E",
            "channel": 5,
            "axis": "A",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        },
        {
            "name": "Servo F",
            "channel": 6,
            "axis": "B",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        },
        {
            "name": "Servo G",
            "channel": 7,
            "axis": "C",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        }
      ],
      "mix": [
        {
            "name": "LArmHyd",
            "parent": "0",
            "axis": 1,
            "parentAxis": 0,
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        },
        {
            "name": "BucketHyd",
            "parent": "0",
            "axis": 0,
            "parentAxis": "1",
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        },
        {
            "name": "BoomHyd",
            "parent": "1",
            "axis": 2,
            "parentAxis": 1,
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        }
      ],
      "mixOutputs": [
        {
            "name": "Hydraulic Pump",
            "axis": [
              0,
              1,
              2
            ],
            "channel": 8,
            "type": "MixTypeMax"
        },

                {
                    "name": "test",
                    "axis": [
                      0,
                      2
                    ],
                    "channel": 9,
                    "type": "MixTypeAvg"
                },
                {
                    "name": "test1",
                    "axis": [
                      0,
                      1
                    ],
                    "channel": 10,
                    "type": "MixTypeMin"
                }
      ]
  },
  {
      "Type": "Slave",
      "Name": "Slave Servo Control1",
      "position": [
        500,
        320
      ],
      "cssClass": "default",
      "panel": ".controls",
      "axis": [
        {
            "name": "Servo E",
            "channel": 5,
            "axis": "A",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        },
        {
            "name": "Servo F",
            "channel": 6,
            "axis": "B",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        },
        {
            "name": "Servo G",
            "channel": 7,
            "axis": "C",
            "enabled": false,
            "reverse": false,
            "limits": {
                "max": 560,
                "min": 150,
                "center": 327,
                "rate": 100,
                "expo": {
                    "above": 1.5,
                    "below": 1.5
                }
            }
        }
      ],
      "mix": [
        {
            "name": "LArmHyd",
            "parent": "0",
            "axis": 1,
            "parentAxis": 0,
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        },
        {
            "name": "BucketHyd",
            "parent": "0",
            "axis": 0,
            "parentAxis": "1",
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        },
        {
            "name": "BoomHyd",
            "parent": "1",
            "axis": 2,
            "parentAxis": 1,
            "below": [
              "max",
              "center"
            ],
            "above": [
              "center",
              "max"
            ]
        }
      ],
      "mixOutputs": [
        {
            "name": "Hydraulic Pump",
            "axis": [
              0,
              1,
              2
            ],
            "channel": 7,
            "type": "MixTypeMax"
        }
      ]
  },
  {
        "Type": "AnalogReader",
        "Name": "Hydraulic Pressure",
        "position": [
          110,
          420
        ],
        "size": [
          200,
          100
        ],
        "cssClass": "default",
        "panel": ".controls",
        "display": "gauge",
        "options": {
            "label": 'PSI',
            "labelOffset": -15,
            "min": 0,
            "max": 500,
            "intervals": [100, 200, 300, 400, 500],
            "colours": ['green', 'green', 'green', 'orange', 'red']
        },
        "reader": {
            "type": "adc",
            "channel": 1,
            "interval": 200,
            "samples": 1,
            "range": {
                min: 0,
                max: 500
            },
            "formula": "(((X * ( 3300.0 / 1023.0 )) - 100.0) / 10.0) - 40.0"
        }

  },
  {
      "Type": "AnalogReader",
      "Name": "Voltage",
      "position": [
        250,
        420
      ],
      "size": [
        200,
        100
      ],
      "cssClass": "default",
      "panel": ".controls",
      "display": "gauge",
      "options": {
          "label": 'Volts',
          "min": 9,
          "max": 12,
          "labelOffset": -15,
          "intervals": [10, 10.5, 11, 11.5, 12],
          "colours": ['red', 'orange', 'orange',' green', 'green']
      },
      "reader": {
          "type": "adc",
          "channel": 2,
          "interval": 1000,
          "samples": 1,
          "range": {
              min: 0,
              max: 3.3
          },
          "formula": "(((X * ( 3300.0 / 1023.0 )) - 100.0) / 10.0) - 40.0"
      }

  },
    {
        "Type": "Slave",
        "Name": "Slave Servo Control1",
        "position": [
          580,
          620
        ],
        "cssClass": "default",
        "panel": ".controls",
        "axis": [
          {
              "name": "Servo E",
              "channel": 5,
              "axis": "A",
              "enabled": false,
              "reverse": false,
              "limits": {
                  "max": 560,
                  "min": 150,
                  "center": 327,
                  "rate": 100,
                  "expo": {
                      "above": 1.5,
                      "below": 1.5
                  }
              }
          },
          {
              "name": "Servo F",
              "channel": 6,
              "axis": "B",
              "enabled": false,
              "reverse": false,
              "limits": {
                  "max": 560,
                  "min": 150,
                  "center": 327,
                  "rate": 100,
                  "expo": {
                      "above": 1.5,
                      "below": 1.5
                  }
              }
          },
          {
              "name": "Servo G",
              "channel": 7,
              "axis": "C",
              "enabled": false,
              "reverse": false,
              "limits": {
                  "max": 560,
                  "min": 150,
                  "center": 327,
                  "rate": 100,
                  "expo": {
                      "above": 1.5,
                      "below": 1.5
                  }
              }
          }
        ],
        "mix": [
          {
              "name": "LArmHyd",
              "parent": "0",
              "axis": 1,
              "parentAxis": 0,
              "below": [
                "max",
                "center"
              ],
              "above": [
                "center",
                "max"
              ]
          },
          {
              "name": "BucketHyd",
              "parent": "0",
              "axis": 0,
              "parentAxis": "1",
              "below": [
                "max",
                "center"
              ],
              "above": [
                "center",
                "max"
              ]
          },
          {
              "name": "BoomHyd",
              "parent": "1",
              "axis": 2,
              "parentAxis": 1,
              "below": [
                "max",
                "center"
              ],
              "above": [
                "center",
                "max"
              ]
          }
        ],
        "mixOutputs": [
          {
              "name": "Hydraulic Pump",
              "axis": [
                0,
                1,
                2
              ],
              "channel": 8,
              "type": "MixTypeMax"
          },

                  {
                      "name": "test",
                      "axis": [
                        0,
                        2
                      ],
                      "channel": 9,
                      "type": "MixTypeAvg"
                  },
                  {
                      "name": "test1",
                      "axis": [
                        0,
                        1
                      ],
                      "channel": 10,
                      "type": "MixTypeMin"
                  }
        ]
    }
]