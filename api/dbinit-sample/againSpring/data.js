import moment from "moment";

function getTime(day = 0, second = 0) {
  return moment()
    .add(day, "days")
    .add(second, "seconds")
    .format("YYYY.MM.DD HH:mm:ss");
}

export const initData = async (clientId, nextSeq) => {
  return {
    // 회원
    user: [
      {
        _id: await nextSeq("user"),
        email: "admin@market.com",
        password:
          "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
        name: "무지",
        phone: "01011112222",
        address: "서울시 강남구 역삼동 123",
        type: "admin",
        loginType: "email",
        image: `/files/${clientId}/user-muzi.webp`,
        createdAt: getTime(-100, -60 * 60 * 3),
        updatedAt: getTime(-100, -60 * 60 * 3),
        extra: {
          birthday: "03-23",
          membershipClass: "MC03",
          addressBook: [
            {
              id: 1,
              name: "집",
              value: "서울시 강남구 역삼동 123",
            },
            {
              id: 2,
              name: "회사",
              value: "서울시 강남구 신사동 234",
            },
          ],
        },
      },
      {
        _id: await nextSeq("user"),
        email: "s2@market.com",
        password:
          "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
        name: "어피치",
        phone: "01033334444",
        address: "서울시 강남구 도곡동 789",
        type: "seller",
        loginType: "email",
        image: `/files/${clientId}/user-apeach.webp`,
        createdAt: getTime(-40, -60 * 30),
        updatedAt: getTime(-30, -60 * 20),
        extra: {
          confirm: false, // 관리자 승인이 안됨
          birthday: "11-24",
          membershipClass: "MC02",
          addressBook: [
            {
              id: 1,
              name: "회사",
              value: "서울시 마포구 연희동 123",
            },
            {
              id: 2,
              name: "가게",
              value: "서울시 강남구 학동 234",
            },
          ],
        },
      },
      {
        _id: await nextSeq("user"),
        email: "u1@market.com",
        password:
          "$2b$10$S.8GNMDyvUF0xzujPtHBu.j5gtS19.OhRmYbpJBnCHg2S83WLx1T2",
        name: "제이지",
        phone: "01044445555",
        address: "서울시 강남구 논현동 222",
        type: "user",
        loginType: "email",
        image: `/files/${clientId}/user-jayg.webp`,
        createdAt: getTime(-20, -60 * 30),
        updatedAt: getTime(-10, -60 * 60 * 12),
        extra: {
          confirm: true,
          birthday: "11-30",
          membershipClass: "MC02",
          address: [
            {
              id: 1,
              name: "회사",
              value: "서울시 강동구 천호동 123",
            },
            {
              id: 2,
              name: "집",
              value: "서울시 강동구 성내동 234",
            },
          ],
        },
      },
      {
        _id: await nextSeq("user"),
        email: "seop96@naver.com",
        password:
          "$2b$10$1O4U0/.br2omQ78TcHns.OR13O3f9/JplktHbqTGJIPxrlzht7.f2",
        name: "윤형섭",
        phone: "01044445555",
        address: "서울시 강남구 논현동 222",
        type: "admin",
        loginType: "email",
        image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        createdAt: getTime(-20, -60 * 30),
        updatedAt: getTime(-10, -60 * 60 * 12),
        extra: {
          confirm: true,
          birthday: "11-30",
          membershipClass: "MC02",
          address: [
            {
              id: 1,
              name: "회사",
              value: "서울시 강동구 천호동 123",
            },
            {
              id: 2,
              name: "집",
              value: "서울시 강동구 성내동 234",
            },
          ],
        },
      },
      {
        _id: await nextSeq("user"),
        email: "test@naver.com",
        password:
          "$2b$10$MXZNCPM9ixo4zZ1XOIJjfu57JL8h2TM5vrzqiUGfIKe/tIc8amZrq",
        name: "당근구십구도",
        phone: "01044445555",
        address: "서울시 강남구 논현동 222",
        type: "user",
        loginType: "email",
        image: `/files/${clientId}/rD3kfWjH8.png`,
        createdAt: getTime(-20, -60 * 30),
        updatedAt: getTime(-10, -60 * 60 * 12),
        extra: {
          confirm: true,
          birthday: "11-30",
          membershipClass: "MC02",
          address: [
            {
              id: 1,
              name: "회사",
              value: "서울시 강동구 천호동 123",
            },
            {
              id: 2,
              name: "집",
              value: "서울시 강동구 성내동 234",
            },
          ],
        },
      },
    ],
    // 카테고리 : bathroom =========================================================================================================
    product: [
      {
        _id: await nextSeq("product"),
        seller_id: 2, // 상품을 등록한 판매자의 고유 ID
        price: 18900, // 상품의 가격 (원)
        shippingFees: 3000, // 상품 배송비 (디폴트 3000원)
        show: true, // 상품의 노출 여부(사용자에게)
        active: true, //활성 상태 여부(true일 경우 상품이 활성화되어 판매가능)
        name: "[그리네라] 대나무화장지30M 30롤",
        quantity: 100, //총 재고 수량 (디폴트 100개)
        buyQuantity: 0, // 판매된 수량 (디폴트 0개)
        mainImages: [
          // 대표 이미지
          {
            path: `/files/${clientId}/[bathroom] bamboo_toilet_paper(1).jpg`, // 이미지 저장 경로
            name: "[bamboo] toilet_paper(1).jpg", // 이미지 이름
            originalname: "[bamboo] toilet_paper(1).jpg", // 업로드 당시 오리지널 이름
          },
          {
            path: `/files/${clientId}/[bathroom] bamboo_toilet_paper(2).jpg`,
            name: "[bamboo] toilet_paper(2).jpg",
            originalname: "[bamboo] toilet_paper(2).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] bamboo_toilet_paper(3).jpg`,
            name: "[bamboo] toilet_paper(3).jpg",
            originalname: "[bamboo] toilet_paper(3).jpg",
          },
        ],
        // 상품 상세 설명 ▼ (이미지로 대체했습니다.)
        content: `
          <div class="product-detail">
              <div align="center">
                <img src="/files/${clientId}/[bathroom] bamboo_toilet_paper_Detail.jpg" alt="[그리네라] 대나무화장지30M 30롤">
              </div>
          </div>`,
        createdAt: getTime(-41, -60 * 60 * 2), // 상품 등록일 (사용X)
        updatedAt: getTime(-40, -60 * 15), // 상품 최신화 등록일 (사용X)
        extra: {
          isNew: true, // 새로운 상품 (true일 경우 new 아이콘 같은거 표시 가능 / 메인 페이지 노출 가능)
          isBest: false, // 베스트 상품 (이하 동일)
          category: ["all-of-list", "bathroom"], // 상품 카테고리 (메뉴 카테고리 별로 상품 분류 작업 가능)
          sort: 5, // 정렬 우선순위 (값이 낮을 수록 목록에서 먼저 표시됨 / 동일한 값일 경우 최신 등록 순으로 표시됨)
          tanso: 10, // 탄소배출량 (상품의 탄소배출량 표시) 재활용 및 재생 가능 소재가 일반적으로 주요 자재보다 탄소 발자국을 적게 발생시킴
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1400,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[자연상점] 대나무 칫솔 (일반형)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] bamboo_toothbrush.jpg`,
            name: "[bathroom] bamboo_toothbrush.jpg",
            originalname: "[bathroom] bamboo_toothbrush.jpg",
          },
        ],
        content: `
          <div class="product-detail">
              <div align="center">
                <img src="/files/${clientId}/[bathroom] bamboo_toothbrush_Detail.jpg" alt="[자연상점] 대나무 칫솔 (일반형)">
              </div>
          </div>`,
        createdAt: getTime(-38, -60 * 60 * 6),
        updatedAt: getTime(-33, -60 * 55),
        extra: {
          isNew: true,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 4,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 9000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[사이로] 두둥 푸딩 거품 샤워타월",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] body_towel(1).jpg`,
            name: "[bathroom] body_towel(1).jpg",
            originalname: "[bathroom] body_towel(1).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] body_towel(2).jpg`,
            name: "[bathroom] body_towel(2).jpg",
            originalname: "[bathroom] body_towel(2).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] body_towel(3).jpg`,
            name: "[bathroom] body_towel(3).jpg",
            originalname: "[bathroom] body_towel(3).jpg",
          },
        ],
        content: `
          <div class="product-detail">
              <div align="center">
                <img src="/files/${clientId}/[bathroom] body_towel_Detail.jpg" alt="[사이로] 두둥 푸딩 거품 샤워타월">
              </div>
          </div>`,
        createdAt: getTime(-35, -60 * 60 * 6),
        updatedAt: getTime(-10, -60 * 19),
        extra: {
          isNew: false,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 3,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 17800,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[에코브릭] 약산성 바디워시바",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] body_wash(1).jpg`,
            name: "[bathroom] body_wash(1).jpg",
            originalname: "[bathroom] body_wash(1).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] body_wash(2).jpg`,
            name: "[bathroom] body_wash(2).jpg",
            originalname: "[bathroom] body_wash(2).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] body_wash(3).jpg`,
            name: "[bathroom] body_wash(3).jpg",
            originalname: "[bathroom] body_wash(3).jpg",
          },
        ],
        content: `
          <div class="product-detail">
              <div align="center">
                <img src="/files/${clientId}/[bathroom] body_wash_Detail.jpg" alt="[에코브릭] 약산성 바디워시바">
              </div>
          </div>`,
        createdAt: getTime(-33, -60 * 60 * 7),
        updatedAt: getTime(-22, -60 * 60 * 3),
        extra: {
          isNew: false,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 1,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[조르단] 그린클린 치실 (30ml)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] dental_floss.jpg`,
            name: "[bathroom] dental_floss.jpg",
            originalname: "[bathroom] dental_floss.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[bathroom] dental_floss_Detail.jpg" alt="[조르단] 그린클린 치실 (30ml)">
              </div>
          </div>`,
        createdAt: getTime(-30, -60 * 60 * 10),
        updatedAt: getTime(-10, -60 * 56),
        extra: {
          isNew: false,
          isBest: true,
          today: true,
          category: ["all-of-list", "bathroom"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[탄소창고] 오목이 비누받침",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] soap_dish(1).jpg`,
            name: "[bathroom] soap_dish(1).jpg",
            originalname: "[bathroom] soap_dish(1).jpg",
          },
          {
            path: `/files/${clientId}/[bathroom] soap_dish(2).jpg`,
            name: "[bathroom] soap_dish(2).jpg",
            originalname: "[bathroom] soap_dish(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[bathroom] soap_dish_Detail.jpg" alt="[탄소창고] 오목이 비누받침">
              </div>
          </div>`,
        createdAt: getTime(-30, -60 * 60 * 21),
        updatedAt: getTime(-20, -60 * 10),
        extra: {
          isNew: true,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 1,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 4500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[자연상점] 동그라미 고체치약 (30정)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] solid_toothpaste.jpg`,
            name: "[bathroom] solid_toothpaste.jpg",
            originalname: "[bathroom] solid_toothpaste.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[bathroom] solid_toothpaste_Detail.jpg" alt="[자연상점] 동그라미 고체치약 (30정)">
              </div>
          </div>`,
        createdAt: getTime(-25, -60 * 60 * 12),
        updatedAt: getTime(-24, -60 * 23),
        extra: {
          isNew: false,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 3,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 800,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구샵] 실리콘 칫솔뚜껑",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[bathroom] toothbrush_cover.jpg`,
            name: "[bathroom] toothbrush_cover.jpg",
            originalname: "[bathroom] toothbrush_cover",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[bathroom] toothbrush_cover_Detail.jpg" alt="[지구샵] 실리콘 칫솔뚜껑">
              </div>
          </div>`,
        createdAt: getTime(-22, -60 * 60 * 22),
        updatedAt: getTime(-20, -60 * 33),
        extra: {
          isNew: true,
          isBest: false,
          category: ["all-of-list", "bathroom"],
          sort: 8,
        },
      },

      // 카테고리 : kitchen =========================================================================================================
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 120000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[벨르썸] 캠핑 산으로 바다로",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] cutting board(1).jpg`,
            name: "[kitchen] cutting board(1).jpg",
            originalname: "[kitchen] cutting board(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] cutting board(2).jpg`,
            name: "[kitchen] cutting board(2).jpg",
            originalname: "[kitchen] cutting board(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] cutting board_Detail.jpg" alt="[벨르썸] 캠핑 산으로 바다로">
              </div>
          </div>`,
        createdAt: getTime(-21, -60 * 60 * 4),
        updatedAt: getTime(-16, -60 * 15),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 15900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[동구밭] 식기세척기 세제 타블렛 240g",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] Detergent.png`,
            name: "[kitchen] Detergent.png",
            originalname: "[kitchen] Detergent.png",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] Detergent_Detail.jpg" alt="[동구밭] 식기세척기 세제 타블렛 240g">
              </div>
          </div>`,
        createdAt: getTime(-18, -60 * 60 * 7),
        updatedAt: getTime(-12, -60 * 33),
        extra: {
          isNew: false,
          isBest: true,
          category: ["all-of-list", "kitchen"],
          sort: 4,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[퀸비스토어] 바른행주 1장 (2겹)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] dishcloth.jpg`,
            name: "[kitchen] dishcloth.jpg",
            originalname: "[kitchen] dishcloth.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] dishcloth_Detail.jpg" alt="[퀸비스토어] 바른행주 1장 (2겹)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 6,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 14000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[아트앤허그] 담비 주방장갑(1p)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] gloves(1).png`,
            name: "[kitchen] gloves(1).png",
            originalname: "[kitchen] gloves(1).png",
          },
          {
            path: `/files/${clientId}/[kitchen] gloves(2).png`,
            name: "[kitchen] gloves(2).png",
            originalname: "[kitchen] gloves(2).png",
          },
          {
            path: `/files/${clientId}/[kitchen] gloves(3).png`,
            name: "[kitchen] gloves(3).png",
            originalname: "[kitchen] gloves(3).png",
          },
        ],
        content: `
           <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] gloves_Detail.jpg" alt="[아트앤허그] 담비 주방장갑(1p)">
              </div>
          </div>`,
        createdAt: getTime(-11, -60 * 60 * 12),
        updatedAt: getTime(-5, -60 * 60 * 6),
        extra: {
          isNew: false,
          isBest: false,
          category: ["all-of-list", "kitchen"],
          sort: 7,
        },
      },
      // 13번 상품
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 11500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[자누담] 해초접시 (1set-10개입)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] plate(1).jpg`,
            name: "[kitchen] plate(1).jpg",
            originalname: "[kitchen] plate(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] plate(2).jpg`,
            name: "[kitchen] plate(2).jpg",
            originalname: "[kitchen] plate(2).jpg",
          },
        ],
        content: `
           <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] plate_Detail.jpg" alt="[자누담] 해초접시 (1set-10개입)">
              </div>
          </div>`,
        createdAt: getTime(-10, -60 * 60 * 12),
        updatedAt: getTime(-5, -60 * 60 * 6),
        extra: {
          isNew: true,
          isBest: false,
          category: ["all-of-list", "kitchen"],
          sort: 6,
        },
      },
      // 14번 상품.
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1800,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[온전히지구] 그대로수세미 (압착형)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] scrubber(1).jpg`,
            name: "[kitchen] scrubber(1).jpg",
            originalname: "[kitchen] scrubber(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] scrubber(2).jpg`,
            name: "[kitchen] scrubber(2).jpg",
            originalname: "[kitchen] scrubber(2).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] scrubber(3).jpg`,
            name: "[kitchen] scrubber(3).jpg",
            originalname: "[kitchen] scrubber(3).jpg",
          },
        ],
        content: `
           <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] scrubber_Detail.jpg" alt="[온전히지구] 그대로수세미 (압착형)">
              </div>
          </div>`,
        createdAt: getTime(-3, -60 * 60 * 12),
        updatedAt: getTime(-3, -60 * 60 * 12),
        extra: {
          isNew: false,
          isBest: false,
          category: ["all-of-list", "kitchen"],
          sort: 5,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 5000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[탄소창고] 다회용 스푼&포크 세트",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] Spoon&Fork_Set.jpg`,
            name: "[kitchen] Spoon&Fork_Set.jpg",
            originalname: "[kitchen] Spoon&Fork_Set.jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] Spoon&Fork_Set(2).jpg`,
            name: "[kitchen] Spoon&Fork_Set(2).jpg",
            originalname: "[kitchen] Spoon&Fork_Set(2).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] Spoon&Fork_Set(3).jpg`,
            name: "[kitchen] Spoon&Fork_Set(3).jpg",
            originalname: "[kitchen] Spoon&Fork_Set(3).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] Spoon&Fork_Set_Detail.jpg" alt="[탄소창고] 다회용 스푼&포크 세트">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: true,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[퀸비스토어] 스테인리스 빨대",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] stainless_steel_straw(1).jpg`,
            name: "[kitchen] stainless_steel_straw(1).jpg",
            originalname: "[kitchen] stainless_steel_straw(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] stainless_steel_straw(2).jpg`,
            name: "[kitchen] stainless_steel_straw(2).jpg",
            originalname: "[kitchen] stainless_steel_straw(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] stainless_steel_straw_Detail.jpg" alt="[퀸비스토어] 스테인리스 빨대">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 6500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[탄소창고] 스탠드주걱",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] stand_spatula(1).jpg`,
            name: "[kitchen] stand_spatula(1).jpg",
            originalname: "[kitchen] stand_spatula(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] stand_spatula(2).jpg`,
            name: "[kitchen] stand_spatula(2).jpg",
            originalname: "[kitchen] stand_spatula(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] stand_spatula_Detail.jpg" alt="[탄소창고] 스탠드주걱">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[소락] 다시백 티백",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] tea_bag.jpg`,
            name: "[kitchen] tea_bag.jpg",
            originalname: "[kitchen] tea_bag.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] tea_bag_Detail.jpg" alt="[소락] 다시백 티백">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 18900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[그리네라] 대나무 키친타올 100매 (12입)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] towel(1).jpg`,
            name: "[kitchen] towel(1).jpg",
            originalname: "[kitchen] towel(1).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] towel(2).jpg`,
            name: "[kitchen] towel(2).jpg",
            originalname: "[kitchen] towel(2).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] towel(3).jpg`,
            name: "[kitchen] towel(3).jpg",
            originalname: "[kitchen] towel(3).jpg",
          },
          {
            path: `/files/${clientId}/[kitchen] towel(4).jpg`,
            name: "[kitchen] towel(4).jpg",
            originalname: "[kitchen] towel(4).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] towel_Detail.jpg" alt="[그리네라] 대나무 키친타올 100매 (12입)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 2200,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[슈가랩] 사탕수수로 만든 지퍼백",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] zipper_bags.jpg`,
            name: "[kitchen] zipper_bags.jpg",
            originalname: "[kitchen] zipper_bags.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[kitchen] zipper_bags_Detail.jpg" alt="[슈가랩] 사탕수수로 만든 지퍼백">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: true,
          today: true,
          category: ["all-of-list", "kitchen"],
          sort: 2,
        },
      },

      // 카테고리 : laundry ====================================================================================
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 9900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[비긴에코] 초강력 초간단 캡슐 세탁조클리너 10개",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[laundry] Cleaner.jpg`,
            name: "[laundry] Cleaner.jpg",
            originalname: "[laundry] Cleaner.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[laundry] Cleaner_Detail.jpeg" alt="[비긴에코] 초강력 초간단 캡슐 세탁조클리너 10개">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "laundry"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 10900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[비긴에코] 섬유유연제 건조기시트 프루티플로럴 80매",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[laundry] dryer_sheet(1).png`,
            name: "[laundry] dryer_sheet(1).png",
            originalname: "[laundry] dryer_sheet(1).png",
          },
          {
            path: `/files/${clientId}/[laundry] dryer_sheet(2).png`,
            name: "[laundry] dryer_sheet(2).png",
            originalname: "[laundry] dryer_sheet(2).png",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[laundry] dryer_sheet_Detail.jpg" alt="[비긴에코] 섬유유연제 건조기시트 프루티플로럴 80매">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "laundry"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 4300,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[꽃마리] 세탁용 과탄산소다솝",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[laundry] Percarbonate_soda(1).jpg`,
            name: "[laundry] Percarbonate_soda(1).jpg",
            originalname: "[laundry] Percarbonate_soda(1).jpg",
          },
          {
            path: `/files/${clientId}/[laundry] Percarbonate_soda(2).jpg`,
            name: "[laundry] Percarbonate_soda(2).jpg",
            originalname: "[laundry] Percarbonate_soda(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[laundry] Percarbonate_soda_Detail.jpeg" alt="[꽃마리] 세탁용 과탄산소다솝">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "laundry"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 26000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[블루워시] 고체 세탁세제 (제라늄/70정)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[laundry] solid_detergent.jpg`,
            name: "[laundry] solid_detergent.jpg",
            originalname: "[laundry] solid_detergent.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[laundry] solid_detergent_Detail.jpg" alt="[블루워시] 고체 세탁세제 (제라늄/70정)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "laundry"],
          sort: 2,
        },
      },

      // 카테고리 : life =======================================================================================
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 5900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[에콜그린] 옥수수콘 커피필터 50매 (사다리꼴형)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] coffee_filter.jpg`,
            name: "[life] coffee_filter.jpg",
            originalname: "[life] coffee_filter.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] coffee_filter_Detail.jpg" alt="[에콜그린] 옥수수콘 커피필터 50매 (사다리꼴형)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: true,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 12000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 플랫 파우치 (Flat Pouch)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] flat_pouch.jpg`,
            name: "[life] flat_pouch.jpg",
            originalname: "[life] flat_pouch.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] flat_pouch_Detail.jpg" alt="[project1907] 플랫 파우치 (Flat Pouch)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[탄소창고] 쑥쑥화분",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] flowerpot(1).jpg`,
            name: "[life] flowerpot(1).jpg",
            originalname: "[life] flowerpot(1).jpg",
          },
          {
            path: `/files/${clientId}/[life] flowerpot(2).jpg`,
            name: "[life] flowerpot(2).jpg",
            originalname: "[life] flowerpot(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] flowerpot_Detail.jpg" alt="[탄소창고] 쑥쑥화분">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 42000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 키즈토트백 (KIDS Tote Bag)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] kdis_tote_bag.jpg`,
            name: "[life] kdis_tote_bag.jpg",
            originalname: "[life] kdis_tote_bag.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] kdis_tote_bag_Detail.jpg" alt="[project1907] 키즈토트백 (KIDS Tote Bag)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 28000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 장우산(대)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] long_umbrella.jpg`,
            name: "[life] long_umbrella.jpg",
            originalname: "[life] long_umbrella.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] long_umbrella_Detail.jpg" alt="[project1907] 장우산(대)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "굴 담은 탈취제",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] oyster_deodorant(1).jpg`,
            name: "[life] oyster_deodorant(1).jpg",
            originalname: "[life] oyster_deodorant(1).jpg",
          },
          {
            path: `/files/${clientId}/[life] oyster_deodorant(2).jpg`,
            name: "[life] oyster_deodorant(2).jpg",
            originalname: "[life] oyster_deodorant(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] oyster_deodorant_Detail.jpg" alt="굴 담은 탈취제">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: true,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 13000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 여권케이스 (Passport Case)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] passport_case.jpg`,
            name: "[life] passport_case.jpg",
            originalname: "[life] passport_case.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] passport_case_Detail.jpg" alt="[project1907] 여권케이스 (Passport Case)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 79000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 비건 백팩 (Vegan Backpack)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] vegan_bagpack.jpg`,
            name: "[life] vegan_bagpack.jpg",
            originalname: "[life] vegan_bagpack.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] vegan_bagpack_Detail.jpg" alt="[project1907] 비건 백팩 (Vegan Backpack)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 90000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[project1907] 비건 호보백 (Vegan Hobo bag)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] vegan_hobo_bag.jpg`,
            name: "[life] vegan_hobo_bag.jpg",
            originalname: "[life] vegan_hobo_bag.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] vegan_hobo_bag_Detail.jpg" alt="[project1907] 비건 호보백 (Vegan Hobo bag)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 18000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[업앤업] 밀랍초",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[life] wax_candle.jpg`,
            name: "[life] wax_candle.jpg",
            originalname: "[life] wax_candle.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[life] wax_candle_Detail.png" alt="[업앤업] 밀랍초">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "life"],
          sort: 2,
        },
      },

      // 카테고리: pet ========================================================================================
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 11900,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[에콜그린] 옥수수콘 생분해 강아지 배변패드 (10매)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[pet] dog_pad.jpg`,
            name: "[pet] dog_pad.jpg",
            originalname: "[pet] dog_pad.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[pet] dog_pad_Detail.jpg" alt="[에콜그린] 옥수수콘 생분해 강아지 배변패드 (10매)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: true,
          today: true,
          category: ["all-of-list", "pet"],
          sort: 2,
        },
      },

      // 카테고리: stationery ==============================================================================
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 17000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[자연상점] 아자아자! 입학 응원 세트",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] admission_gift.jpg`,
            name: "[stationery] admission_gift.jpg",
            originalname: "[stationery] admission_gift.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] admission_gift_Detail.jpg" alt="[자연상점] 아자아자! 입학 응원 세트">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[스테이그린] 사탕수수 메모지 - Check list",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] check_list.jpg`,
            name: "[stationery] check_list.jpg",
            originalname: "[stationery] check_list.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] check_list_Detail.jpg" alt="[스테이그린] 사탕수수 메모지 - Check list">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구나무] A5 재생지 노트(유선)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] note.jpg`,
            name: "[stationery] note.jpg",
            originalname: "[stationery] note.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] note_Detail.jpg" alt="[지구나무] A5 재생지 노트(유선)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: true,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 4800,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구나무] 페이퍼 클립 (높은음자리표) - 10개입",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] paper_clip.jpg`,
            name: "[stationery] paper_clip.jpg",
            originalname: "[stationery] paper_clip.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] paper_clip_Detail.jpg" alt="[지구나무] 페이퍼 클립 (높은음자리표) - 10개입">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구나무] 신문지 업사이클링 연필(5개입)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] pencil.gif`,
            name: "[stationery] pencil.gif",
            originalname: "[stationery] pencil.gif",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] pencil_Detail.jpg" alt="[지구나무] 신문지 업사이클링 연필(5개입)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: true,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구나무] [RE]재생가죽 펜슬캡",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] pencil_cap.jpg`,
            name: "[stationery] pencil_cap.jpg",
            originalname: "[stationery] pencil_cap.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] pencil_cap_Detail.jpg" alt="[지구나무] [RE]재생가죽 펜슬캡">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3500,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[지구나무] 폐나무 분말 연필깎이",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] pencil_sharpener.jpg`,
            name: "[stationery] pencil_sharpener.jpg",
            originalname: "[stationery] pencil_sharpener.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] pencil_sharpener_Detail.jpg" alt="[지구나무] 폐나무 분말 연필깎이">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: true,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 1600,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[프린텍]재생지포스트잇 세로형 100매",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] postit(1).jpg`,
            name: "[stationery] postit(1).jpg",
            originalname: "[stationery] postit(1).jpg",
          },
          {
            path: `/files/${clientId}/[stationery] postit(2).jpg`,
            name: "[stationery] postit(2).jpg",
            originalname: "[stationery] postit(2).jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] postit_Detail.jpg" alt="[프린텍]재생지포스트잇 세로형 100매">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: false,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },
      {
        _id: await nextSeq("product"),
        seller_id: 2,
        price: 3000,
        shippingFees: 3000,
        show: true,
        active: true,
        name: "[자연상점] 신문지 연필세트 (연필3개+크라프트연필통)",
        quantity: 100,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[stationery] stationery_set.jpg`,
            name: "[stationery] stationery_set.jpg",
            originalname: "[stationery] stationery_set.jpg",
          },
        ],
        content: `
          <div class="product-detail">
            <div align="center">
                <img src="/files/${clientId}/[stationery] stationery_set_Detail.jpg" alt="[자연상점] 신문지 연필세트 (연필3개+크라프트연필통)">
              </div>
          </div>`,
        createdAt: getTime(-16, -60 * 60 * 3),
        updatedAt: getTime(-15, -60 * 45),
        extra: {
          isNew: false,
          isBest: true,
          today: true,
          category: ["all-of-list", "stationery"],
          sort: 2,
        },
      },

      // 옵션이 있는 경우 메인 상품 정보
      {
        _id: await nextSeq("product"),
        seller_id: 3,
        price: 12900,
        shippingFees: 3500,
        show: false,
        active: false,
        name: "테스트용 (메인상품정보1)",
        quantity: 999999,
        buyQuantity: 0,
        mainImages: [
          {
            path: `/files/${clientId}/[kitchen] (1).jpg`,
            name: "[kitchen] (1).jpg",
            originalname: "샤넬.jpg",
          },
        ],
        content: `샤넬 향수`,
        createdAt: getTime(-3, -60 * 60 * 12),
        updatedAt: getTime(-3, -60 * 60 * 12),
        extra: {
          depth: 1,
        },
      },
      // 16번 상품. 옵션이 있는 경우 옵션 상품 정보. 15번 상품의 하위 상품(옵션)
      {
        _id: await nextSeq("product"),
        seller_id: 3,
        price: 6900,
        shippingFees: 3500,
        name: "테스트용 (메인상품정보2)",
        quantity: 100,
        buyQuantity: 0,
        show: false,
        active: false,
        mainImages: [
          {
            path: `/files/${clientId}/sample-pushpop03.jpg`,
            name: "sample-pushpop03.jpg",
            originalname: "샤넬.jpg",
          },
        ],
        content: `3달 쓴 향수입니다.`,
        createdAt: getTime(-3, -60 * 60 * 12),
        updatedAt: getTime(-3, -60 * 60 * 12),
        extra: {
          depth: 2,
          parent: 15,
          size: "200mm",
        },
      },
    ],
    // 주문
    order: [
      // 빈배열
    ],
    // 후기
    review: [
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 2,
          name: "배고파앙",
          image: `/files/${clientId}/rD3kfWjH8.png`,
        },
        order_id: 1,
        product_id: 19,
        rating: 5,
        content: "아이가 좋아해요.",
        createdAt: getTime(-4, -60 * 60 * 12),
      },
      {
        _id: await nextSeq("review"),
        user_id: 2,
        user: {
          _id: 2,
          name: "행슥",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 4,
        product_id: 19,
        rating: 4,
        content: "배송이 좀 느려요.",
        createdAt: getTime(-3, -60 * 60 * 1),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "일찐",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 20,
        rating: 1,
        content: "품질이 좋아요",
        extra: {
          title: "또살게요",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "비실이",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 20,
        rating: 1,
        content: "하루만에 다썻어요",
        extra: {
          title: "추천하지 않습니다.",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "머머리",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 23,
        rating: 1,
        content: "잘쓰고있어요",
        extra: {
          title: "감사합니다",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "랑글롱이",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 23,
        rating: 1,
        content: "우와 너무 좋아요",
        extra: {
          title: "감사합니다 잘쓰고있어요",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "가면라읻",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 24,
        rating: 1,
        content: "우와 너무 좋아요",
        extra: {
          title: "감사합니다 잘쓰고있어요",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
      {
        _id: await nextSeq("review"),
        user_id: 4,
        user: {
          _id: 4,
          name: "네버랜드",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        order_id: 2,
        product_id: 24,
        rating: 1,
        content: "그냥그래요",
        extra: {
          title: "좋지도 나쁘지도않아요",
        },
        createdAt: getTime(-2, -60 * 60 * 10),
      },
    ],
    // 장바구니
    cart: [
      {
        _id: await nextSeq("cart"),
        user_id: 4,
        product_id: 1,
        quantity: 2,
        createdAt: getTime(-7, -60 * 30),
        updatedAt: getTime(-7, -60 * 30),
      },
      {
        _id: await nextSeq("cart"),
        user_id: 4,
        product_id: 2,
        quantity: 100,
        createdAt: getTime(-4, -60 * 30),
        updatedAt: getTime(-3, -60 * 60 * 12),
      },
      {
        _id: await nextSeq("cart"),
        user_id: 2,
        product_id: 3,
        quantity: 2,
        createdAt: getTime(-3, -60 * 60 * 4),
        updatedAt: getTime(-3, -60 * 60 * 4),
      },
      {
        _id: await nextSeq("cart"),
        user_id: 2,
        product_id: 4,
        quantity: 3,
        createdAt: getTime(-2, -60 * 60 * 12),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
    ],
    // 즐겨찾기/북마크
    bookmark: [
      {
        _id: await nextSeq("bookmark"),
        user_id: 4,
        user: {
          _id: 4,
          name: "제이지",
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: "product",
        target_id: 2,
        memo: "첫째 크리스마스 선물.",
        createdAt: getTime(-3, -60 * 60 * 2),
      },
      {
        _id: await nextSeq("bookmark"),
        user_id: 4,
        user: {
          _id: 4,
          name: "제이지",
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: "product",
        target_id: 4,
        memo: "둘째 생일 선물",
        createdAt: getTime(-1, -60 * 60 * 12),
      },
      {
        _id: await nextSeq("bookmark"),
        user_id: 4,
        user: {
          _id: 4,
          name: "제이지",
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: "user",
        target_id: 2,
        memo: "단골 셀러",
        createdAt: getTime(-2, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("bookmark"),
        user_id: 4,
        user: {
          _id: 4,
          name: "제이지",
          image: `/files/${clientId}/user-jayg.webp`,
        },
        type: "post",
        target_id: 1,
        memo: "크기 문의글 북마크",
        createdAt: getTime(-1, -60 * 60 * 12),
      },
      {
        _id: await nextSeq("bookmark"),
        user_id: 2,
        user: {
          _id: 2,
          name: "네오",
          image: `/files/${clientId}/user-neo.webp`,
        },
        type: "product",
        target_id: 4,
        memo: "1순위로 살것!",
        createdAt: getTime(-1, -60 * 60 * 12),
      },
    ],
    // QnA, 공지사항 등의 게시판

    // QnA 게시판
    post: [
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 1,
        seller_id: 2,
        views: 5,
        user: {
          _id: 4,
          name: "제이지",
          image: "user-jayg.webp",
        },
        title: "크기가 얼만만한가요?",
        content: "아이가 6살인데 가지고 놀기 적당한 크기인가요?",
        replies: [
          {
            _id: 1,
            user_id: 2,
            user: {
              _id: 2,
              name: "네오",
              image: "user-neo.webp",
            },
            content: "크기는 상품 상세정보에 나와 있습니다.",
            like: 5,
            createdAt: getTime(-2, -60 * 60 * 20),
            updatedAt: getTime(-2, -60 * 60 * 2),
          },
          {
            _id: 2,
            user_id: 4,
            user: {
              _id: 4,
              name: "제이지",
              image: "user-jayg.webp",
            },
            content: "어디있나 모르겠어요.",
            like: 7,
            createdAt: getTime(-2, -60 * 60 * 10),
            updatedAt: getTime(-2, -60 * 60 * 1),
          },
          {
            _id: 3,
            user_id: 2,
            user: {
              _id: 2,
              name: "네오",
              image: "user-neo.webp",
            },
            content: "높이 60cm 입니다.",
            like: 3,
            createdAt: getTime(-2, -60 * 60 * 9),
            updatedAt: getTime(-1, -60 * 60 * 20),
          },
        ],
        createdAt: getTime(-3, -60 * 60 * 2),
        updatedAt: getTime(-3, -60 * 60 * 2),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 1,
        seller_id: 2,
        views: 50,
        user: {
          _id: 4,
          name: "제이지",
          image: "user-jayg.webp",
        },
        title: "이번주 토요일까지 받아볼 수 있을까요?",
        content: "토요일 생일 선물로 준비중인데 그때까지 배송 가능할까요?",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 19,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "루비루비",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "상품 문의드립니다!",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 19,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "차파차파",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "상품이 친절하고 사장이 맛있어요",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 20,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "치피치피",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "배송이 안와여",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 20,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "춘식이",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "배송이 늦게오는데 언제와요",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },

      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 23,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "땅캐슬",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "상품 문의드립니다 ",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 23,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "zl존전사",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "상품이 깨져서왔어요",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 24,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "타노스",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "생각보다 크기가 작아요",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },
      {
        _id: await nextSeq("post"),
        type: "qna",
        product_id: 24,
        seller_id: 2,
        views: 0,
        user: {
          _id: 4,
          name: "얼음!!!!!!!",
          image: `/files/${clientId}/U2Fj_NuP4.jpg`,
        },
        title: "배송이 늦어요",
        content: "안녕하세요!!!!",
        createdAt: getTime(-2, -60 * 60 * 1),
        updatedAt: getTime(-1, -60 * 60 * 20),
      },

      // 공지사항 게시판
      {
        _id: await nextSeq("post"),
        type: "notice",
        views: 10,
        user: {
          _id: 1,
          name: "무지",
          image: "user-muzi.webp",
        },
        title: "배송지연 안내",
        content:
          "크리스마스 물류 증가로 인해 평소보다 2~3일 지연될 예정입니다.",
        createdAt: getTime(-4, -60 * 60 * 2),
        updatedAt: getTime(-2, -60 * 60 * 13),
      },
      {
        _id: await nextSeq("post"),
        type: "notice",
        views: 15,
        user: {
          _id: 1,
          name: "무지",
          image: "user-muzi.webp",
        },
        title: "배송비 인상 안내",
        content:
          "택배사 배송비 인상으로 인해 기존 3,000원에서 3,500원으로 인상됩니다.",
        createdAt: getTime(-6, -60 * 60 * 20),
        updatedAt: getTime(-4, -60 * 60 * 13),
      },
    ],
    // 코드
    code: [
      {
        _id: "productCategory",
        title: "상품 카테고리",
        codes: [
          {
            sort: 2,
            code: "PC01",
            value: "어린이",
            depth: 1,
          },
          {
            sort: 3,
            code: "PC0101",
            value: "퍼즐",
            parent: "PC01",
            depth: 2,
          },
          {
            sort: 1,
            code: "PC0102",
            value: "보드게임",
            parent: "PC01",
            depth: 2,
          },
          {
            sort: 2,
            code: "PC010201",
            value: "2인용",
            parent: "PC0102",
            depth: 3,
          },
          {
            sort: 1,
            code: "PC010202",
            value: "3~4인용",
            parent: "PC0102",
            depth: 3,
          },
          {
            sort: 2,
            code: "PC0103",
            value: "레고",
            parent: "PC01",
            depth: 2,
          },
          {
            sort: 4,
            code: "PC0104",
            value: "로봇",
            parent: "PC01",
            depth: 2,
          },

          {
            sort: 1,
            code: "PC02",
            value: "스포츠",
            depth: 1,
          },
          {
            sort: 1,
            code: "PC0201",
            value: "축구",
            parent: "PC02",
            depth: 2,
          },
          {
            sort: 3,
            code: "PC0202",
            value: "야구",
            parent: "PC02",
            depth: 2,
          },
          {
            sort: 2,
            code: "PC0203",
            value: "농구",
            parent: "PC02",
            depth: 2,
          },

          {
            sort: 3,
            code: "PC03",
            value: "어른",
            depth: 1,
          },
          {
            sort: 1,
            code: "PC0301",
            value: "원격 조종",
            parent: "PC03",
            depth: 2,
          },
          {
            sort: 2,
            code: "PC0302",
            value: "퍼즐",
            parent: "PC03",
            depth: 2,
          },
          {
            sort: 3,
            code: "PC0303",
            value: "레고",
            parent: "PC03",
            depth: 2,
          },
        ],
      },
      {
        _id: "orderState",
        title: "주문 상태",
        codes: [
          {
            sort: 1,
            code: "OS010",
            value: "주문 완료",
          },
          {
            sort: 2,
            code: "OS020",
            value: "결제 완료",
          },
          {
            sort: 3,
            code: "OS030",
            value: "배송 준비중",
          },
          {
            sort: 4,
            code: "OS035",
            value: "배송중",
          },
          {
            sort: 5,
            code: "OS040",
            value: "배송 완료",
          },
          {
            sort: 6,
            code: "OS110",
            value: "반품 요청",
          },
          {
            sort: 7,
            code: "OS120",
            value: "반품 처리중",
          },
          {
            sort: 8,
            code: "OS130",
            value: "반품 완료",
          },
          {
            sort: 9,
            code: "OS210",
            value: "교환 요청",
          },
          {
            sort: 10,
            code: "OS220",
            value: "교환 처리중",
          },
          {
            sort: 11,
            code: "OS230",
            value: "교환 완료",
          },
          {
            sort: 12,
            code: "OS310",
            value: "환불 요청",
          },
          {
            sort: 13,
            code: "OS320",
            value: "환불 처리중",
          },
          {
            sort: 14,
            code: "OS330",
            value: "환불 완료",
          },
        ],
      },
      {
        _id: "membershipClass",
        title: "회원 등급",
        codes: [
          {
            sort: 1,
            code: "MC01",
            value: "일반",
            discountRate: 0, // 할인율
          },
          {
            sort: 2,
            code: "MC02",
            value: "프리미엄",
            discountRate: 10,
          },
          {
            sort: 3,
            code: "MC03",
            value: "VIP",
            discountRate: 20,
          },
        ],
      },
    ],
    // 설정
    config: [
      {
        _id: "shippingFees",
        title: "배송비",
        value: 3000,
      },
      {
        _id: "freeShippingFees",
        title: "배송비 무료 금액",
        value: 50000,
      },
    ],
  };
};
