const CardItem = ({
  card,
  allClassDataType,
  draging,
  drop,
  mouseEnterClass,
  mouseLeaveClass,
  mousePosition,
  editeLeft,
  editeRight,
  deleteCard,
  deleteInherit,
  deleteAttribute,
  deleteMethod,
  deleteParameter,
}) => {
  const _accessor = [
    "private",
    "public",
    "protected",
    "internal",
    "protected internal",
    "private internal",
  ];

  const _accessorModifier = [
    "static",
    "readonly",
    "const",
    "sealed",
    "unsafe",
    "virtual",
    "volatile",
    "abstact",
    "async",
    "event",
    "exturn",
    "in",
    "new",
    "out",
  ];

  const _collectionDataType = [
    "Array[]",
    "List<T>",
    "LinkedList<T>",
    "Queue<T>",
    "Stack<T>",
    "SortedSet<T>",
    "HashSet<T>",
    "task<T>",
    "Hashtable.add(string,T)",
    "SortedList<string,T>",
    "ArrayList.add(T)",
    "Dictionary <string,T>",
    "SortedDictionary<string,T>",
    "Tuple<T1-T8>",
  ];

  ///waitting for class append
  let _normalDataType = [
    //[...ClassDataType]// [{uuid:'s6df6sd5',ClassName:''}]
    { id: 0, name: "void" },
    { id: 1, name: "bool" },
    { id: 2, name: "char" },
    { id: 3, name: "string" },
    { id: 4, name: "int" },
    { id: 5, name: "decimal" },
    { id: 6, name: "unsigned int - ulong" },
    { id: 7, name: "float - double" },
  ];

  let classDatatype = allClassDataType.map((x) => {
    return { id: x.id, name: x.class.name };
  });
  _normalDataType = [..._normalDataType, ...classDatatype];

  ///waitting for class append
  let _normalDataTypeParameter = [
    { id: 0, name: "bool" },
    { id: 1, name: "char" },
    { id: 2, name: "string" },
    { id: 3, name: "int" },
    { id: 4, name: "decimal" },
    { id: 5, name: "unsigned int - ulong" },
    { id: 6, name: "float - double" },
  ];

  _normalDataTypeParameter = [..._normalDataTypeParameter, ...classDatatype];

  const _accessorParameter = ["out", "ref"];

  const _accessorModifierMethod = [
    "static",
    "sealed",
    "virtual",
    "abstact",
    "overide",
  ];

  const _accClass = [
    "private",
    "public",
    "seal",
    "partial",
    "static",
    "interface",
    "abstact",
  ];
  //function get name
  const lGetClass_s = ({ accessor, name }) => {
    return `${_accClass[accessor] ? _accClass[accessor] : ""} class ${
      name ? name : ""
    }`;
  };

  const lGetInherite_s = ({ accessor, name }) => {
    return `${_accClass[accessor] ? _accClass[accessor] : ""} ${
      name ? name : ""
    }`;
  };

  const lGetAttribute_s = ({
    accessor,
    accessorModifier,
    collectionType = null,
    dataType,
    name,
  }) => {
    return `${_accessor[accessor]} ${
      accessorModifier ? _accessorModifier[accessorModifier] : ""
    } ${
      collectionType !== null
        ? _collectionDataType[collectionType].includes("T") === true
          ? _collectionDataType[collectionType].replace(
              "T",
              _normalDataType.find((x) => x.id === dataType)?.name
            )
          : _collectionDataType[collectionType]
        : _normalDataType.find((x) => x.id === dataType)?.name
    } ${name}`;
  };

  const lGetMethod_s = ({
    accessor,
    accessorModifier = null,
    dataType,
    collectionType = null,
    name,
  }) => {
    return `${_accessor[accessor]} ${
      accessorModifier ? _accessorModifierMethod[accessorModifier] : ""
    } ${
      collectionType !== null
        ? _collectionDataType[collectionType].includes("T") === true
          ? _collectionDataType[collectionType].replace(
              "T",
              _normalDataType.find((x) => x.id === dataType)?.name
            )
          : _collectionDataType[collectionType]
        : _normalDataType.find((x) => x.id === dataType)?.name
    } ${name}(#)`;
  };

  const lGetParameter_s = (
    { accessor, dataType, collectionType = null, name },
    allClass
  ) => {
    return `${
      _accessorParameter[accessor] === undefined
        ? ""
        : _accessorParameter[accessor]
    } ${
      collectionType !== null
        ? _collectionDataType[collectionType].includes("T") === true
          ? _collectionDataType[collectionType].replace(
              "T",
              _normalDataTypeParameter.find((x) => x.id === dataType)?.name
            )
          : _collectionDataType[collectionType]
        : _normalDataTypeParameter[dataType]?.name
    } ${name}`;
  };

  const lCopyClass_s = () => {
    const __inherite = card.inherite.reduce(
      (previousValue, currentValue) => previousValue + currentValue.name + ",",
      ":"
    );

    const __attribute = card.attribute.reduce(
      (previousValue, currentValue) =>
        previousValue + lGetAttribute_s(currentValue) + "{ get; set; }\n\t",
      ""
    );

    const __method = card.method.reduce(
      (previousValue, currentValue) =>
        previousValue +
        "\t" +
        lGetMethod_s(currentValue).replace(
          /#/g,
          currentValue.params
            .reduce((prev, curent) => prev + lGetParameter_s(curent) + ",", "")
            .split("")
            .reverse()
            .slice(1)
            .reverse()
            .join("")
        ) +
        "\n\t{\n \n\t}\n",
      ""
    );

    return `${lGetClass_s(card.class)} ${
      __inherite.endsWith(":")
        ? __inherite.replace(/:/g, "")
        : __inherite.endsWith(",")
        ? __inherite.substring(0, __inherite.length - 1)
        : __inherite
    } 
    \n{\n
  \t${__attribute}
  ${__method}}\n`;
  };

  const [position, setPosition] = useState({ left: 100, top: 100, width: 280 });

  //capture mouseposiotion
  useEffect(() => {
    if (card.isDraging) {
      setPosition((x) => {
        return { ...x, top: mousePosition.top, left: mousePosition.left };
      });
    } else {
      setPosition((x) => {
        return { ...x, top: card.position.top, left: card.position.left };
      });
    }
  }, [mousePosition]);

  return (
    <Card
      style={{
        top: position.top,
        left: position.left,
        width: position.width + "px",
      }}
      action={card.isDraging ? "draging" : "" || card.isHover ? "hover" : ""}
      onMouseUp={() => {
        if (card.isDraging) {
          drop(card.id, { top: position.top, left: position.left }); //set update position
        }
      }}
    >
      <HeaderContainer>
        <HeaderIcon
          onClick={() => {
            navigator.clipboard.writeText(lCopyClass_s());
          }}
        >
          <FaCopy />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            draging(card.id);
          }}
        >
          <FaArrowsAlt />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            if (editeLeft) editeLeft(card.id);
          }}
        >
          <FaArrowLeft />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            if (editeRight) editeRight(card.id);
          }}
        >
          <FaArrowRight />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            setPosition((x) => {
              return { ...x, width: 280 };
            });
          }}
        >
          <FaSearchMinus />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            setPosition((x) => {
              return { ...x, width: x.width + 10 };
            });
          }}
        >
          <FaSearchPlus />
        </HeaderIcon>
        <HeaderIcon
          onClick={() => {
            if (deleteCard) deleteCard(card.id);
          }}
        >
          <FaTimes />
        </HeaderIcon>
      </HeaderContainer>

      <ClassContainer>
        <ClassNameItem itemRank={"f"} isFirst={true}>
          {lGetClass_s(card?.class)}
        </ClassNameItem>
        {/* [{ accessor: 1, id:212, name: 'name' }] */}
        {card?.inherite?.map((x, i) => (
          <ClassNameItem
            key={i}
            isFirst={false}
            onMouseEnter={() => mouseEnterClass(x.id)}
            onMouseLeave={mouseLeaveClass}
          >
            <TextWraper>{lGetInherite_s(x)}</TextWraper>
            <DeleteItemBtn onClick={() => deleteInherit(card.id, x.id)}>
              <FaTimes />
            </DeleteItemBtn>
          </ClassNameItem>
        ))}
      </ClassContainer>

      <AttributeContainer>
        <Attribute isFirst={true}>Attbute</Attribute>
        {/*        {
          accessor: 2,
          accessorModifier: 3,
          collectionType: null,
          dataType: 1 or uuid, 
          name: "",
        }*/}
        {card?.attribute?.map((x, i) => (
          <Attribute
            key={i}
            isFirst={false}
            onMouseEnter={() => mouseEnterClass(x.dataType)}
            onMouseLeave={mouseLeaveClass}
          >
            <TextWraper>{lGetAttribute_s(x)}</TextWraper>
            <DeleteItemBtn onClick={() => deleteAttribute(card?.id, x.name)}>
              <FaTimes />
            </DeleteItemBtn>
          </Attribute>
        ))}
      </AttributeContainer>

      <MethodeContainer>
        <Methode isFirst={true}>Methode</Methode>
        {/*accessor: 1,
          accessorModifier: 2,
          dataType: 1 uuid, *********************
          collectionType: null,
          name: "methoddfgsdfgdfsg",
          params: [
            { accessor: 0, collectionType: ,dataType: 0, name: "" },
          ]*/}
        {card?.method?.map((x, i) => (
          <Methode
            key={i}
            itemRank={card.method.length === i ? "l" : ""}
            isFirst={false}
            onMouseEnter={() => mouseEnterClass(x.dataType)}
            onMouseLeave={mouseLeaveClass}
          >
            <TextWraper>{lGetMethod_s(x)}</TextWraper>
            <ParameterContainer>
              {x.params.map((xx, ii) => (
                <Parameter
                  key={ii}
                  onMouseEnter={() => mouseEnterClass(x.dataType)}
                  onMouseLeave={mouseLeaveClass}
                >
                  {lGetParameter_s(xx)}
                  <DeleteItemBtn
                    onClick={() =>
                      deleteParameter({ idS: card?.id, methodI: i, paramI: ii })
                    }
                  >
                    <FaTimes />
                  </DeleteItemBtn>
                </Parameter>
              ))}
            </ParameterContainer>
            <DeleteItemBtn
              onClick={() => deleteMethod({ idS: card?.id, indexI: i })}
            >
              <FaTimes />
            </DeleteItemBtn>
          </Methode>
        ))}
      </MethodeContainer>
    </Card>
  );
};